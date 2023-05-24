import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { QueryDanmu } from './danmu.dto';
import { DanmuService } from '../danmu/danmu.service';
import { Success } from 'src/utils/response';
import { NestLogger } from 'nest-logs';

// @NestLogger()
@Controller('danmu')
export class DanmuController {
  constructor(private readonly danmuService: DanmuService) {}
  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDanmu(@Query() queryParmas: QueryDanmu) {
    return Success(await this.danmuService.getDanmu(queryParmas), '查询成功');
  }
}
