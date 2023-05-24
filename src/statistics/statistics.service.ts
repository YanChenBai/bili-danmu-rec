import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger(StatisticsService.name);

  async danmu() {
    const res = await this.prismaService.roomInfo.findMany();
    const roomIds = res.map((item) => item.roomId);
    return await this.prismaService.danmu.groupBy({
      by: ['roomId'],
      _count: true,
      where: {
        roomId: { in: roomIds },
      },
    });
  }
}
