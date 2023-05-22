import { IsNotEmpty } from 'class-validator';

export class Danmu {
  @IsNotEmpty()
  public page: number;
  @IsNotEmpty()
  public id: number;
}
