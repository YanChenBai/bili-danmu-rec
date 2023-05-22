import { IsNotEmpty } from 'class-validator';

export class Danmu {
  @IsNotEmpty()
  public page = 1;
  @IsNotEmpty()
  public id: number;
}
