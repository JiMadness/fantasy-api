## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript soccer manager game API.

## Requirements
Soccer online manager game API

Write a RESTful API for a simple application where football/soccer fans will create fantasy teams and will be able to sell or buy players.
- User must be able to create an account and log in using the API.
- Each user can have only one team (user is identified by an email)
- When the user is signed up, they should get a team of 20 players (the system should generate players):
  * 3 goalkeepers
  * 6 defenders
  * 6 midfielders
  * 5 attackers
- Each player has an initial value of $1.000.000.
- Each team has an additional $5.000.000 to buy other players.
- When logged in, a user can see their team and player information
    Team has the following information:
  * Team name and a country (can be edited)
  * Team value (sum of player values)
- Player has the following information
  * First name, last name, country (can be edited by a team owner)
  * Age (random number from 18 to 40) and market value
- A team owner can set the player on a transfer list
- When a user places a player on a transfer list, they must set the asking price/value for this player. This value should be listed on a market list. When another user/team buys this player, they must be bought for this price.
- Each user should be able to see all players on a transfer list.
- With each transfer, team budgets are updated.
- When a player is transferred to another team, their value should be increased between 10 and 100 percent. Implement a random factor for this purpose.


## Dependencies installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## TODO
1. Add unit tests and e2e tests