import { OmitType } from '@nestjs/mapped-types';
import { UpdateTeamDto as TeamUpdateTeamDto } from '../../team/team/dto/update-team.dto';

export class UpdateTeamDto extends OmitType(TeamUpdateTeamDto, ['team'] as const) {
}