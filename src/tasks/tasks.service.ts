import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { StatisticsService } from '../statistics/statistics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DanmuService } from 'src/danmu/danmu.service';
import getDate from 'src/utils/getDate';

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
    await this.danmuService.listenerStart();
  }
  //   @Timeout(1000)
  @Cron('* * 1 * * *')
  async handleInterval() {
    const res = await this.statisticsService.danmu();
    const counts = res.map((item) => ({
      roomId: item.roomId,
      count: item._count,
      createTime: getDate(),
    }));
    const danmuCountRes = await this.prismaService.danmuCount.createMany({
      data: counts,
    });
    this.logger.debug(counts, danmuCountRes);
  }
}
