import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DanmuService } from '../danmu/danmu.service';
import { PrismaModule } from '../prisma/prisma.module';
import Config from 'src/config/config';
import { InfoController } from '../info/info.controller';
import { DanmuController } from '../danmu/danmu.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppController, InfoController, DanmuController],
  providers: [AppService, DanmuService],
})
export class AppModule {
  constructor(private readonly danmuService: DanmuService) {
    Config.rooms.forEach(async (id) => await danmuService.listenerStart(id));
  }
}
