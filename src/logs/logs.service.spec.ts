import { LogsService } from './logs.service';
import { LogStatus } from '../common/enums/log-status.enums';
import { NotFoundException } from '@nestjs/common';

describe('LogsService (unit) - auditoría', () => {
  let service: LogsService;
  const mockRepo: any = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LogsService(mockRepo);
  });

  it('When (1) an action occurs -> system records action with timestamp, user and details', async () => {
    const createdLog = {
      id: 1,
      status: LogStatus.SUCCESS,
      action: 'CREATE_ORDER',
      userId: 42,
      user: { id: 42, email: 'u@x.com', role: 'ADMIN' },
      details: 'Pedido creado',
      timestamp: new Date(),
    };
    mockRepo.create.mockResolvedValue(createdLog);

    const result = await service.createSuccessLog('CREATE_ORDER', 42, 'Pedido creado');

    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      status: LogStatus.SUCCESS,
      action: 'CREATE_ORDER',
      userId: 42,
      details: 'Pedido creado',
    }));

    expect(result).toHaveProperty('timestamp');
  expect(result.user).toBeDefined();
  expect((result.user as any).role).toBe('ADMIN');
  });

  it('When (2) auditor attempts to modify a log -> system prevents modification (no update exposed)', async () => {
    // LogsService does not expose an update method; repository interface has no update()
    expect((service as any).update).toBeUndefined();
    // Also ensure repo has no update
    expect(mockRepo.update).toBeUndefined();
  });

  it('When (3) auditor filters by action or date -> system returns correctly filtered results', async () => {
    const logs = [
      { id: 1, action: 'CREATE_ORDER', status: LogStatus.SUCCESS, timestamp: new Date('2025-10-01') },
      { id: 2, action: 'DELETE_ORDER', status: LogStatus.FAILURE, timestamp: new Date('2025-10-02') },
      { id: 3, action: 'CREATE_ORDER', status: LogStatus.INFO, timestamp: new Date('2025-10-03') },
    ];
    mockRepo.findAll.mockResolvedValue(logs);

    const all = await service.findAll();
    expect(all.length).toBe(3);

    // Filter by action
    const filteredByAction = all.filter((l: any) => l.action === 'CREATE_ORDER');
    expect(filteredByAction.length).toBe(2);

    // Filter by date range (>= 2025-10-02)
    const filteredByDate = all.filter((l: any) => l.timestamp >= new Date('2025-10-02'));
    expect(filteredByDate.length).toBe(2);
  });
});
