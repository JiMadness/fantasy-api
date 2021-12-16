import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from '../auth/auth.service';
import { TeamService } from '../team/team/team.service';
import { MarketService } from '../market/market.service';
import * as Bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UpdateTeamPlayerDto } from './dto/update-team-player.dto';
import { PlacePlayerOnTransferListDto } from './dto/place-player-on-transfer-list.dto';
import { TransferPlayerDto } from './dto/transfer-player.dto';
import { Team } from '../team/team/team.schema';
import { LeanDocument } from 'mongoose';
import { Player } from '../team/player/player.schema';
import { Market } from '../market/market.schema';

@Controller()
export class AppController {
  constructor(private appService: AppService,
              private authService: AuthService,
              private teamService: TeamService,
              private marketService: MarketService) {
  }

  @Get('/uptime')
  getUptime(): number {
    return this.appService.getUptime();
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth/session')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('/team')
  async createTeam(@Body() body: CreateTeamDto): Promise<LeanDocument<Team>> {
    body.password = body.password && await Bcrypt.hash(body.password, 10);
    const team = await this.teamService.create(body);
    const result = team.toObject();

    delete result.password;

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/team')
  getTeam(@Request() req): Promise<LeanDocument<Team>> {
    return req.user.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/team')
  async updateTeam(@Request() req, @Body() body: UpdateTeamDto): Promise<LeanDocument<Team>> {
    body.password = body.password && await Bcrypt.hash(body.password, 10);
    const team = await this.teamService.updateTeam(Object.assign({ team: req.user }, body));
    const result =  team.toObject();

    delete result.password;

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/team/player')
  async updateTeamPlayer(@Request() req, @Body() body: UpdateTeamPlayerDto): Promise<LeanDocument<Player>> {
    const player = await this.teamService.updateTeamPlayer(Object.assign({ team: req.user }, body));

    return player.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/market/list')
  async getTransferList(): Promise<LeanDocument<Market>[]> {
    const transferList = await this.marketService.getTransferList();

    return transferList.map((entry) => entry.toObject());
  }

  @UseGuards(JwtAuthGuard)
  @Post('/market/list')
  async placePlayerOnTransferList(@Request() req, @Body() body: PlacePlayerOnTransferListDto): Promise<LeanDocument<Market>> {
    const entry = await this.marketService.placePlayerOnTransferList(Object.assign({ team: req.user }, body));

    return entry.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/market/transfer')
  async transferPlayer(@Request() req, @Body() body: TransferPlayerDto): Promise<LeanDocument<Team>> {
    const targetTeam = await this.marketService.buyPlayer(Object.assign({ targetTeam: req.user }, req.body));

    return targetTeam.toObject();
  }
}
