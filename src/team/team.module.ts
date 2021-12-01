import { Module } from '@nestjs/common';
import { TeamService } from './team/team.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './team/team.schema';
import { Player, PlayerSchema } from './player/player.schema';
import { PlayerService } from './player/player.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
  ],
  providers: [TeamService, PlayerService],
  exports: [TeamService],
})
export class TeamModule {
}
