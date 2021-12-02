import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from './player.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { getCode, getNames } from 'country-list';
import { PlayerPosition } from './player-position.enum';
import { EnhancePlayerValueDto } from './dto/enhance-player-value.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  private readonly initialGKCount: number;
  private readonly initialDEFCount: number;
  private readonly initialMIDCount: number;
  private readonly initIalATKCount: number;
  private readonly minimumPlayerAge: number;
  private readonly maximumPlayerAge: number;
  private readonly initialPlayerValue: number;

  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
              private configService: ConfigService) {
    this.initialGKCount = configService.get<number>('INITIAL_GK_COUNT');
    this.initialDEFCount = configService.get<number>('INITIAL_DEF_COUNT');
    this.initialMIDCount = configService.get<number>('INITIAL_MID_COUNT');
    this.initIalATKCount = configService.get<number>('INITIAL_ATK_COUNT');
    this.minimumPlayerAge = configService.get<number>('MINIMUM_PLAYER_AGE');
    this.maximumPlayerAge = configService.get<number>('MAXIMUM_PLAYER_AGE');
    this.initialPlayerValue = configService.get<number>('PLAYER_INITIAL_VALUE');
  }

  private generateUniqueName(): string {
    return uniqueNamesGenerator({
      length: 1,
      style: 'capital',
      dictionaries: [names],
    });
  }

  private generateRandomBirthYear(): number {
    return new Date().getFullYear() -
      Math.floor(Math.random() * (this.maximumPlayerAge - this.minimumPlayerAge) + this.minimumPlayerAge);
  }

  private generateRandomCountryCode(): string {
    const countriesList = getNames();
    return getCode(countriesList[Math.floor(Math.random() * (countriesList.length - 1))]);
  }

  async generateInitialPlayers(): Promise<PlayerDocument[]> {
    const initialPlayersPromises = [];

    for (let i = 0; i < this.initIalATKCount; i++) {
      initialPlayersPromises.push(new this.playerModel({
        firstName: this.generateUniqueName(),
        lastName: this.generateUniqueName(),
        birthYear: this.generateRandomBirthYear(),
        country: this.generateRandomCountryCode(),
        position: PlayerPosition.ATTACKER,
        value: this.initialPlayerValue,
      }).save());
    }

    for (let i = 0; i < this.initialMIDCount; i++) {
      initialPlayersPromises.push(new this.playerModel({
        firstName: this.generateUniqueName(),
        lastName: this.generateUniqueName(),
        birthYear: this.generateRandomBirthYear(),
        country: this.generateRandomCountryCode(),
        position: PlayerPosition.MIDFIELD,
        value: this.initialPlayerValue,
      }).save());
    }

    for (let i = 0; i < this.initialDEFCount; i++) {
      initialPlayersPromises.push(new this.playerModel({
        firstName: this.generateUniqueName(),
        lastName: this.generateUniqueName(),
        birthYear: this.generateRandomBirthYear(),
        country: this.generateRandomCountryCode(),
        position: PlayerPosition.DEFENDER,
        value: this.initialPlayerValue,
      }).save());
    }

    for (let i = 0; i < this.initialGKCount; i++) {
      initialPlayersPromises.push(new this.playerModel({
        firstName: this.generateUniqueName(),
        lastName: this.generateUniqueName(),
        birthYear: this.generateRandomBirthYear(),
        country: this.generateRandomCountryCode(),
        position: PlayerPosition.GOALKEEPER,
        value: this.initialPlayerValue,
      }).save());
    }

    return Promise.all(initialPlayersPromises);
  }

  async enhancePlayerValue(enhancePlayerValueDto: EnhancePlayerValueDto): Promise<PlayerDocument> {
    const player = enhancePlayerValueDto.player;

    player.value += Math.floor(Math.random() * player.value);

    return player.save();
  }

  async updatePlayer(updatePlayerDto: UpdatePlayerDto): Promise<PlayerDocument> {
    const player = updatePlayerDto.player;

    if (updatePlayerDto.firstName) {
      player.firstName = updatePlayerDto.firstName;
    }

    if (updatePlayerDto.lastName) {
      player.lastName = updatePlayerDto.lastName;
    }

    if (updatePlayerDto.firstName) {
      player.country = getCode(updatePlayerDto.country);
    }

    return player.save();
  }
}
