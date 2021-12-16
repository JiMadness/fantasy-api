import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Market, MarketDocument } from './market.schema';
import { Model } from 'mongoose';
import { PlacePlayerOnTransferListDto } from './dto/place-player-on-transfer-list.dto';
import { TeamService } from '../team/team/team.service';
import { BuyPlayerDto } from './dto/buy-player.dto';
import { TeamDocument } from '../team/team/team.schema';

@Injectable()
export class MarketService {
  constructor(@InjectModel(Market.name) private marketModel: Model<MarketDocument>,
              private teamService: TeamService) {
  }

  async getTransferList(): Promise<MarketDocument[]> {
    return this.marketModel.find();
  }

  async placePlayerOnTransferList(placePlayerOnTransferListDto: PlacePlayerOnTransferListDto): Promise<MarketDocument> {
    const targetTeam = placePlayerOnTransferListDto.team;
    const targetPlayer = targetTeam.players.find((player) => player._id.equals(placePlayerOnTransferListDto.playerId));

    if (!targetPlayer) {
      throw new NotFoundException('Player not found within team.');
    }
    const entry = new this.marketModel({
      player: targetPlayer,
      ownerTeam: targetTeam,
      askingPrice: placePlayerOnTransferListDto.askingPrice,
    });

    return entry.save();
  }

  async buyPlayer(transferPlayerDto: BuyPlayerDto): Promise<TeamDocument> {
    let entry = await this.marketModel.findById(transferPlayerDto.entryId).populate('ownerTeam');

    if (!entry) {
      throw new NotFoundException('Market entry not found.');
    }

    const updatedTeam = await this.teamService.transferTeamPlayer({
      sourceTeamEmail: entry.ownerTeam.email,
      destinationTeamEmail: transferPlayerDto.targetTeam.email,
      playerId: entry.player._id,
      sellPrice: entry.askingPrice,
    });

    await this.marketModel.findByIdAndRemove(entry._id);

    return updatedTeam;
  }
}
