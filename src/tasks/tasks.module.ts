import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { StatisticsService } from 'src/statistics/statistics.service';
import { DanmuService } from 'src/danmu/danmu.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [TasksService, StatisticsService, DanmuService, RoomService],
})
export class TasksModule {}
