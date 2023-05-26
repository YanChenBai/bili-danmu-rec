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
  async trst() {
    const strartTime = getDay().startOf('day').format();
    const id = '6154037';
    const res = await this.prismaService.$queryRaw<
      Array<{
        hour: string;
        count: number;
      }>
    >`SELECT DATE_FORMAT(receiveTime, '%Y-%m-%d %H:00:00') AS hour, COUNT(*) AS count FROM Danmu WHERE roomId = ${id} AND receiveTime >= ${strartTime} GROUP BY hour`;

    console.log(res);
  }
}
