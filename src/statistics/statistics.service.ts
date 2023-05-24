import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getDay, today } from 'src/utils/day';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(StatisticsService.name);

  // 统计弹幕
  async danmu() {
    const resRoom = await this.prismaService.roomInfo.findMany({
      select: { roomId: true },
    });
    const roomIds = resRoom.map((item) => item.roomId);

    const res = await this.prismaService.danmu.groupBy({
      by: ['roomId'],
      _count: true,
      where: {
        roomId: { in: roomIds },
        receiveTime: { gte: getDay().startOf('d').format() },
      },
    });
    const counts = res.map((item) => ({
      roomId: item.roomId,
      count: item._count,
      createTime: today(),
    }));
    const danmuCountRes = await this.prismaService.danmuCount.createMany({
      data: counts,
    });
    this.logger.debug(counts, danmuCountRes);
  }
}
