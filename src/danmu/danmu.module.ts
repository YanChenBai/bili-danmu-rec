import { Module } from '@nestjs/common';
import { DanmuController } from './danmu.controller';
import { DanmuService } from './danmu.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [DanmuService, RoomService],
  controllers: [DanmuController],
})
export class DanmuModule {}
