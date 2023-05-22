import { Module } from '@nestjs/common';
import { DanmuController } from './danmu.controller';

@Module({
  controllers: [DanmuController]
})
export class DanmuModule {}
