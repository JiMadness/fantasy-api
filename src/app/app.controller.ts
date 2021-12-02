import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from '../auth/auth.service';
import { TeamService } from '../team/team/team.service';
import { MarketService } from '../market/market.service';
import * as Bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

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
  async createTeam(@Body() body) {
    body.password = body.password && await Bcrypt.hash(body.password, 10);
    const team = await this.teamService.create(body);

    return team.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/team')
  async updateTeam(@Body() body) {
    const team = await this.teamService.updateTeam(body);

    return team.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/team/player')
  async updateTeamPlayer(@Request() req) {
    const player = await this.teamService.updateTeamPlayer(Object.assign({ team: req.user }, req.body));

    return player.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/market/list')
  async getTransferList() {
    const transferList = await this.marketService.getTransferList();

    return transferList.map((entry) => entry.toObject());
  }

  @UseGuards(JwtAuthGuard)
  @Post('/market/list')
  async placePlayerOnTransferList(@Request() req) {
    const entry = await this.marketService.placePlayerOnTransferList(Object.assign({ team: req.user }, req.body));

    return entry.toObject();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/market/transfer')
  async transferPlayer(@Request() req) {
    const targetTeam = await this.marketService.buyPlayer(Object.assign({ targetTeam: req.user }, req.body));

    return targetTeam.toObject();
  }
}
