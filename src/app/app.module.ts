import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DanmuService } from '../danmu/danmu.service';
import { PrismaModule } from '../prisma/prisma.module';
import Config from 'src/config/config';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, DanmuService],
})
export class AppModule {
  constructor(private readonly danmuService: DanmuService) {
    Config.rooms.forEach((id) => danmuService.listenerStart(id));
  }
}
