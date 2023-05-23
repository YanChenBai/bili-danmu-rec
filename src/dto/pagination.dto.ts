import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class Pagination {
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  public page = 1;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Number)
  public pageSize = 100;
}

export class PaginationRes<T> {
  results: T[];
  pageSzie: number;
  count: number;
  page: number;
}
