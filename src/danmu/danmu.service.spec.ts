import { Test, TestingModule } from '@nestjs/testing';
import { DanmuService } from './danmu.service';

describe('DanmuService', () => {
  let service: DanmuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DanmuService],
    }).compile();

    service = module.get<DanmuService>(DanmuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
