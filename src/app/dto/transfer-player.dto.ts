import { BuyPlayerDto } from '../../market/dto/buy-player.dto';
import { OmitType } from '@nestjs/mapped-types';

export class TransferPlayerDto extends OmitType(BuyPlayerDto, ['targetTeam'] as const) {
}