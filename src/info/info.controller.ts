import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Success } from 'src/utils/response';

@Controller('info')
export class InfoController {
  constructor(private readonly prismaService: PrismaService) {}
  @Get('userList')
  async getUserList() {
    try {
      return Success(await this.prismaService.roomInfo.findMany(), '获取成功!');
    } catch (error) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
