import { UpdateTeamPlayerDto as TeamUpdateTeamPlayerDto } from '../../team/team/dto/update-team-player.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateTeamPlayerDto extends OmitType(TeamUpdateTeamPlayerDto, ['team'] as const) {
}