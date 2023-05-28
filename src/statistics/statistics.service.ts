import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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

  // 统计每小时弹幕数量
  async hourDanmu(id: string) {
    const strartTime = getDay().startOf('day').format();
    const format = '%Y-%m-%d %H:00:00';
    try {
      const res = await this.prismaService.$queryRaw<
        Array<{
          hour: string;
          count: number;
        }>
      >`
      SELECT
          DATE_FORMAT(
              receiveTime,
              ${format}
          ) AS hour,
          COUNT(*) AS count
      FROM Danmu
      WHERE
          roomId = ${id}
          AND receiveTime >= ${strartTime}
      GROUP BY hour
      `;
      return res.map((item) => {
        item.count = Number(item.count);
        return item;
      });
    } catch (error) {
      throw new HttpException('获取失败!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
