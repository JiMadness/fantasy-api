import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Connection, Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { PlayerService } from '../player/player.service';
import { ConfigService } from '@nestjs/config';
import { getCode } from 'country-list';
import { GetTeamByEmailDto } from './dto/get-team-by-email.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TransferTeamPlayerDto } from './dto/transfer-team-player.dto';

@Injectable()
export class TeamService {
  private readonly initialTeamBalance: number;

  constructor(@InjectConnection() private connection: Connection,
              @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
              private configService: ConfigService,
              private playerService: PlayerService) {
    this.initialTeamBalance = configService.get<number>('TEAM_INITIAL_BALANCE');
  }

  async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
    createTeamDto.country = getCode(createTeamDto.country);

    const team = new this.teamModel(createTeamDto);

    team.players = await this.playerService.generateInitialPlayers();
    team.balance = this.initialTeamBalance;

    return team.save();
  }

  async getTeamByEmail(getTeamByEmailDto: GetTeamByEmailDto): Promise<TeamDocument> {
    let teamPromise = this.teamModel.findById(getTeamByEmailDto.email),
      team;

    if (getTeamByEmailDto.getPassword) {
      teamPromise = teamPromise.select('+password');
    }

    if (getTeamByEmailDto.session) {
      teamPromise = teamPromise.session(getTeamByEmailDto.session);
    }

    team = await teamPromise;

    if (!team) {
      throw new Error('Team not found.');
    }

    return team;
  }

  async updateTeam(updateTeamDto: UpdateTeamDto): Promise<TeamDocument> {
    const team = await this.getTeamByEmail({ email: updateTeamDto.email, getPassword: !!updateTeamDto.password });

    if (updateTeamDto.country) {
      team.country = getCode(updateTeamDto.country);
    }

    if (updateTeamDto.name) {
      team.name = updateTeamDto.name;
    }

    if (updateTeamDto.password) {
      team.password = updateTeamDto.password;
    }

    return team.save();
  }

  async transferTeamPlayer(transferTeamPlayerDto: TransferTeamPlayerDto): Promise<TeamDocument> {
    const transactionSession = await this.connection.startSession();

    let sourcePlayer,
      destinationTeam;

    await transactionSession.withTransaction(async () => {
      const sourceTeam = await this.getTeamByEmail({
        email: transferTeamPlayerDto.sourceTeamEmail,
        session: transactionSession,
      });
      // @ts-expect-error
      sourcePlayer = sourceTeam.players.find((player) => player._id.equals(transferTeamPlayerDto.playerId));

      if (!sourcePlayer) {
        throw new Error('Player not found in team.');
      }

      destinationTeam = await this.getTeamByEmail({
        email: transferTeamPlayerDto.destinationTeamEmail,
        session: transactionSession,
      });

      if (sourceTeam.equals(destinationTeam)) {
        throw new Error('Cannot transfer player to own team.');
      }

      // @ts-expect-error
      sourceTeam.players = sourceTeam.players.filter((player) => !player._id.equals(sourcePlayer._id));
      destinationTeam.players.push(sourcePlayer);
      sourceTeam.balance += transferTeamPlayerDto.sellPrice;
      destinationTeam.balance -= transferTeamPlayerDto.sellPrice;

      await sourceTeam.save();
      await destinationTeam.save();
    });

    await transactionSession.endSession();

    await this.playerService.enhancePlayerValue(sourcePlayer);

    return await this.getTeamByEmail({ email: destinationTeam.email });
  }
}
