import * as repo from '../auth.repository';
import * as service from '../auth.service';

jest.mock('../auth.repository');
const mockFindUser = repo.findUser as jest.MockedFunction<typeof repo.findUser>;

describe('auth service testing', () => {
  afterEach(()=> jest.clearAllMocks());
  it('not found- null return', async () => {
    mockFindUser.mockResolvedValue(null);
    const result = await service.validateCreds('abc@gmail.com', 'test123');
    expect(result).toBeNull();
  });

  it('pswd wrong-null return', async () => {
    mockFindUser.mockResolvedValue({ id: 1, email: 'a1@gmail.com', password: 'pass12', token: null });
    const result = await service.validateCreds('a1@a.com', 'pass23');
    expect(result).toBeNull();
  });

  it('valid cred- return user', async () => {
    mockFindUser.mockResolvedValue({ id: 1, email: 'a@gmail.com', password: 'pass', token: null });
    const result = await service.validateCreds('a@gmail.com', 'pass');
    expect(result?.user.token).toBeDefined();
  });
});
