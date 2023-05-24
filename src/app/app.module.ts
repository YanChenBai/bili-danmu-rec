import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NestLogsModule } from 'nest-logs';
import { DanmuModule } from 'src/danmu/danmu.module';
import { RoomModule } from 'src/room/room.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    NestLogsModule,
    DanmuModule,
    RoomModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
