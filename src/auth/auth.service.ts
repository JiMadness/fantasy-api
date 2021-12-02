import { Injectable } from '@nestjs/common';
import { TeamService } from '../team/team/team.service';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { Team } from '../team/team/team.schema';

@Injectable()
export class AuthService {
  constructor(private teamService: TeamService, private jwtService: JwtService) {
  }

  async validateTeam(email: string, password: string) {
    let team = await this.teamService.getTeamByEmail({ email, getPassword: true });

    if (team && await Bcrypt.compare(password, team.password)) {
      return team.toObject();
    }

    return null;
  }

  async login(team: Team) {
    const payload = { sub: team.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
