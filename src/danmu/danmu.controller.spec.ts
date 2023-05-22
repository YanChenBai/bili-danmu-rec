import { Test, TestingModule } from '@nestjs/testing';
import { DanmuController } from './danmu.controller';

describe('DanmuController', () => {
  let controller: DanmuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanmuController],
    }).compile();

    controller = module.get<DanmuController>(DanmuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
