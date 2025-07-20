import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../services/adminService';

const mockQuery = vi.fn();
const mockRequest = {
  input: vi.fn().mockReturnThis(),
  query: mockQuery,
};

vi.mock('../configs/sqlConfig', () => {
  return {
    sql: {
      NVarChar: 'NVarChar',
      Int: 'Int',
      Bit: 'Bit',
      DateTime: 'DateTime'
    },
    poolPromise: Promise.resolve({
      request: () => mockRequest
    })
  };
});

describe('adminService unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createUser returns success boolean', async () => {
    mockQuery.mockResolvedValueOnce({ rowsAffected: [1] });

    const result = await service.createUser(1, { dummy: true });
    expect(result).toBe(true);
  });

  it('getUserById returns single record', async () => {
    const mockData = {
      auth0_id: "auth0|abc123",
      avatar: null,
      created_at: new Date("2025-05-15T00:00:00.000Z"),
      email: "john@example.com",
      fcm_token: null,
      isBanned: 0,
      is_social: 0,
      role: "Member",
      sub_id: 2,
      time_to_send_push: null,
      updated_at: null,
      user_id: 1,
      username: "john_doe",
      vip_end_date: new Date("2025-07-29T00:00:00.000Z")
    };

    mockQuery.mockResolvedValueOnce({ recordset: [mockData] });

    const result = await service.getUserById(1);
    expect(result).toEqual(mockData);
  });

  it('updateUserById returns success boolean', async () => {
    mockQuery.mockResolvedValueOnce({ rowsAffected: [1] });

    const result = await service.updateUserById(1, { dummy: true });
    expect(result).toBe(true);
  });

  it('deleteUserById returns success boolean', async () => {
    mockQuery.mockResolvedValueOnce({ rowsAffected: [1] });

    const result = await service.deleteUserById(1, { dummy: true });
    expect(result).toBe(true);
  });
});