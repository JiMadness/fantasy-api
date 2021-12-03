import { ArgumentsHost, Catch, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        super.catch(new ConflictException('Duplicate entry.'), host);
        break;
      default:
        super.catch(exception, host);
        break;
    }
  }
}