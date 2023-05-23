import { Controller, Get, Query } from '@nestjs/common';
import { Danmu } from './danmu.dto';
import { DanmuService } from '../danmu/danmu.service';
import { Success } from 'src/utils/response';

@Controller('danmu')
export class DanmuController {
  constructor(private readonly danmuService: DanmuService) {}
  @Get('list')
  async getDanmu(@Query() data: Danmu) {
    return Success(await this.danmuService.getDanmu(data), '查询成功');
  }
}
