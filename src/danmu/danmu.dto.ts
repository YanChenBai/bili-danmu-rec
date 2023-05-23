import { IsNotEmpty } from 'class-validator';

export class Danmu {
  public uname = '';
  public msg = '';
  @IsNotEmpty()
  public page: number;
  @IsNotEmpty()
  public id: number;
}
