import { PlacePlayerOnTransferListDto as MarketPlacePlayerOnTransferListDto } from '../../market/dto/place-player-on-transfer-list.dto';
import { OmitType } from '@nestjs/mapped-types';

export class PlacePlayerOnTransferListDto extends OmitType(MarketPlacePlayerOnTransferListDto, ['team'] as const) {
}