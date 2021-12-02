import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { TeamModule } from '../team/team.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Market, MarketSchema } from './market.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]),
    TeamModule,
  ],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {
}
