
import request from 'supertest';
import app from '../../../app';
import * as service from '../auth.service';

jest.mock('../auth.service');
const mockValidateCreds = service.validateCreds as jest.MockedFunction<typeof service.validateCreds>;

describe('auth login controller test', () => {
  afterEach(() => jest.clearAllMocks());
  it('400 err- missfields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'a@gmail.com' });
    expect(res.status).toBe(400);
  });

  it('401-invalid cred', async () => {
    mockValidateCreds.mockResolvedValue(null); //not set
    const res = await request(app).post('/api/auth/login').send({ email: 'a@gmail.com', password: 'pass' });
    expect(res.status).toBe(401);
  });

  it('valid creds- success 200', async () => {
    mockValidateCreds.mockResolvedValue({ user: { id: '1', email: 'a@gmail.com', token: 'mock12' } });
    const res = await request(app).post('/api/auth/login').send({ email: 'a@gmail.com', password: 'abc12' });
    expect(res.status).toBe(200);
    expect(res.body.data.user.token).toBeDefined();
  });
});