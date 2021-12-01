import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUptime(): number {
    return process.uptime();
  }
}
