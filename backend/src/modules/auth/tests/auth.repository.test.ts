
import * as repo from '../auth.repository';
import { db } from '../../../db';

jest.mock('../../../db');
const mockDb = db as jest.Mocked<typeof db>;

describe('auth repo test', () => {
  it('user found', async () => {
    mockDb.runQuery.mockResolvedValue({
      rows: [{ id: 1, email: 'abc@gmail.com', password: 'test123', token: null }]} as any);
    const user = await repo.findUser('abc@gmail.com');
    expect(user?.password).toBe('test123');
  });

  it('not found-null retrun', async () => {
    mockDb.runQuery.mockResolvedValue({rows: []} as any);
    const user = await repo.findUser('x@x.com');
    expect(user).toBeNull();
  });
});
