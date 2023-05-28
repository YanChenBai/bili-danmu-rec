import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { StatisticsService } from '../statistics/statistics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DanmuService } from 'src/danmu/danmu.service';
import { getDay } from 'src/utils/day';

@Injectable()
export class TasksService {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly prismaService: PrismaService,
    private readonly danmuService: DanmuService,
  ) {}
  private readonly logger = new Logger(TasksService.name);
  @Timeout(1000)
  async updateDanmu() {
    // await this.danmuService.listenerStart();
  }
  // @Timeout(1000)
  // @Cron('* * 1 * * *')
  async statisticsDanmu() {
    await this.statisticsService.danmu();
  }

  @Timeout(100)
  async test() {
    this.logger.debug(await this.statisticsService.hourDanmu('6154037'));
  }
}
