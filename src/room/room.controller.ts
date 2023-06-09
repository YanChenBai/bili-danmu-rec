import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AddRoom } from './room.dto';
import { Success } from 'src/utils/response';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async add(@Body() params: AddRoom) {
    return Success(await this.roomService.addRoomInfo(params.id));
  }

  @Get('get')
  async getUserList() {
    return Success(await this.roomService.getRoomList(), '获取成功!');
  }

  @Get('todayDanmuCount')
  async todayDanmuCount() {
    return Success(await this.roomService.todayDanmuCount());
  }
}
