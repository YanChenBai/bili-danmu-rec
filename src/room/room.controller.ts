import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { AddRoom } from './room.dto';
import { Success } from 'src/utils/response';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async add(@Body() params: AddRoom) {
    return Success(await this.roomService.addRoomInfo(params.id));
  }
}
