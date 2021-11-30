import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { PlayerService } from '../player/player.service';
import { ConfigService } from '@nestjs/config';
import { getCode } from 'country-list';
import { GetTeamByEmailDto } from './dto/get-team-by-email.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  private readonly initialTeamBalance: number;

  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>,
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
    if (getTeamByEmailDto.getPassword) {
      return this.teamModel.findById(getTeamByEmailDto.email).select('+password');
    }

    return this.teamModel.findById(getTeamByEmailDto.email).then((team) => {
      if (!team) {
        throw new Error('Team not found.');
      }

      return team;
    });
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
}
