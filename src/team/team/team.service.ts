import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
import { PlayerDocument } from '../player/player.schema';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';

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
      throw new NotFoundException('Team not found.');
    }

    return team;
  }

  async updateTeam(updateTeamDto: UpdateTeamDto): Promise<TeamDocument> {
    const team = updateTeamDto.team;

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

  async updateTeamPlayer(updateTeamPlayerDto: UpdateTeamPlayerDto): Promise<PlayerDocument> {

    const player = updateTeamPlayerDto.team.players.find((player) => player._id.equals(updateTeamPlayerDto.playerId));
    return this.playerService.updatePlayer({
      player,
      firstName: updateTeamPlayerDto.firstName,
      lastName: updateTeamPlayerDto.lastName,
      country: updateTeamPlayerDto.country,
    });
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
      sourcePlayer = sourceTeam.players.find((player) => player._id.equals(transferTeamPlayerDto.playerId));

      if (!sourcePlayer) {
        throw new NotFoundException('Player not found in team.');
      }

      destinationTeam = await this.getTeamByEmail({
        email: transferTeamPlayerDto.destinationTeamEmail,
        session: transactionSession,
      });

      if (sourceTeam.equals(destinationTeam)) {
        throw new ConflictException('Cannot transfer player to own team.');
      }

      sourceTeam.players = sourceTeam.players.filter((player) => !player._id.equals(sourcePlayer._id));
      destinationTeam.players.push(sourcePlayer);
      sourceTeam.balance += transferTeamPlayerDto.sellPrice;
      destinationTeam.balance -= transferTeamPlayerDto.sellPrice;

      await sourceTeam.save();
      await destinationTeam.save();
    });

    await transactionSession.endSession();

    await this.playerService.enhancePlayerValue({ player: sourcePlayer, newValue: transferTeamPlayerDto.sellPrice });

    return await this.getTeamByEmail({ email: destinationTeam.email });
  }
}
