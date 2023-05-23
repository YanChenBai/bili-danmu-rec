import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Pagination } from 'src/dto/pagination.dto';

// 查询弹幕
export class QueryDanmu extends Pagination {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  public uname?: string;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => String)
  public msg?: string;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  public startTime?: number;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  public endTime?: number;

  @IsNotEmpty()
  @Type(() => String)
  public roomId: string;
}
