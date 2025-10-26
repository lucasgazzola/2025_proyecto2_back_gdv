import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogStatus } from '../common/enums/log-status.enums';

describe('LogsController (unit)', () => {
  let controller: LogsController;
  const mockService: any = {
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new LogsController(mockService as LogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll -> returns logs from service', async () => {
    const logs = [
      { id: 1, status: LogStatus.SUCCESS, action: 'A', timestamp: new Date() },
      { id: 2, status: LogStatus.FAILURE, action: 'B', timestamp: new Date() },
    ];
    mockService.findAll.mockResolvedValue(logs);

    const res = await controller.findAll();
    expect(mockService.findAll).toHaveBeenCalled();
    expect(res).toEqual(logs);
  });
});
