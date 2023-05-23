import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DanmuService } from '../danmu/danmu.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InfoController } from '../info/info.controller';
import { DanmuController } from '../danmu/danmu.controller';
import { RoomService } from '../room/room.service';
import { RoomController } from '../room/room.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, InfoController, DanmuController, RoomController],
  providers: [AppService, DanmuService, RoomService],
})
export class AppModule {
  constructor(private readonly danmuService: DanmuService) {
    // danmuService.listenerStart();
  }
}
