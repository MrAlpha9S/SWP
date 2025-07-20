import { describe, it, expect, vi, beforeEach } from 'vitest';

// ✅ Tell Vitest to use the manual mock
vi.mock('../services/adminService');

// ✅ Import the mocked service to get access to mock functions
import * as adminService from '../services/adminService';

describe('Admin Controller - Users', () => {
  let req, res;
  let handleGetAllUsers, handleCreateUser, handleGetUserById, handleUpdateUser; //add functions here

  beforeEach(async () => {
    vi.clearAllMocks();

    const mockedService = await import('../services/adminService');

    const path = require.resolve('../services/adminService');

    require.cache[path] = {
      exports: mockedService,
      loaded: true,
      id: path
    };

    delete require.cache[require.resolve('../controllers/adminController')];
    const controller = require('../controllers/adminController');

    handleGetAllUsers = controller.handleGetAllUsers;
    handleCreateUser = controller.handleCreateUser;
    handleGetUserById = controller.handleGetUserById;
    handleUpdateUser = controller.handleUpdateUser;
    //add functions here

    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('handleGetAllUsers', () => {
    it('should return 200 with users', async () => {
      const fakeUsers = [{ user_id: 1, username: 'john' }];
      vi.mocked(adminService.getAllUsers).mockResolvedValue(fakeUsers);

      await handleGetAllUsers(req, res);

      expect(adminService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: fakeUsers
      });
    });

    it('should return 500 on error', async () => {
      vi.mocked(adminService.getAllUsers).mockRejectedValue(new Error('DB error'));

      await handleGetAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch users'
      });
    });
  });

  describe('handleCreateUser', () => {
    it('should verify mock is working', () => {
      expect(vi.isMockFunction(adminService.createUser)).toBe(true);
    });

    it('debug - final check', async () => {
      const serviceViaRequire = require('../services/adminService');
      console.log('Service via require after cache patch:', serviceViaRequire.createUser);
      console.log('Is require mocked after cache patch?', vi.isMockFunction(serviceViaRequire.createUser));

      const serviceViaImport = await import('../services/adminService');
      console.log('Is import still mocked?', vi.isMockFunction(serviceViaImport.createUser));

      console.log('Are they the same after cache patch?', serviceViaRequire.createUser === serviceViaImport.createUser);
    });

    it('should return 400 if username or email is missing', async () => {
      req.body = { username: 'test' }; // no email

      await handleCreateUser(req, res);

      expect(adminService.createUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username and email are required'
      });
    });

    it('should return 201 on successful user creation', async () => {
      req.body = {
        username: 'test',
        email: 'test@example.com'
      };

      // Add logging to see what's happening
      vi.mocked(adminService.createUser).mockImplementation((...args) => {
        console.log('🟢 MOCK createUser called with:', args);
        return Promise.resolve(true);
      });

      console.log('📝 About to call handleCreateUser');
      await handleCreateUser(req, res);
      console.log('✅ handleCreateUser completed');

      expect(adminService.createUser).toHaveBeenCalledWith({
        username: 'test',
        email: 'test@example.com',
        role: undefined,
        avatar: undefined,
        isBanned: undefined
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User created successfully'
      });
    });

    it('should return 400 if user creation fails', async () => {
      req.body = {
        username: 'test',
        email: 'test@example.com'
      };
      vi.mocked(adminService.createUser).mockResolvedValue(false);

      await handleCreateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create user'
      });
    });

    it('should return 500 on service error', async () => {
      req.body = {
        username: 'test',
        email: 'test@example.com'
      };
      vi.mocked(adminService.createUser).mockRejectedValue(new Error('error'));

      await handleCreateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create user'
      });
    });
  });

  describe('handleGetUserById', () => {
    it('should return 200 with user data', async () => {
      req.params.id = '1';
      const mockUser = { user_id: 1, username: 'john' };
      vi.mocked(adminService.getUserById).mockResolvedValue(mockUser);

      await handleGetUserById(req, res);

      expect(adminService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser
      });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = '1';
      vi.mocked(adminService.getUserById).mockResolvedValue(null);

      await handleGetUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('should return 500 on service error', async () => {
      req.params.id = '1';
      vi.mocked(adminService.getUserById).mockRejectedValue(new Error('fail'));

      await handleGetUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch user'
      });
    });
  });

  describe('handleUpdateUser', () => {
    it('should return 200 when user is updated', async () => {
      req.params.id = '1';
      req.body = { username: 'new' };
      vi.mocked(adminService.updateUserById).mockResolvedValue(true);

      await handleUpdateUser(req, res);

      expect(adminService.updateUserById).toHaveBeenCalledWith(1, { username: 'new' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User updated successfully'
      });
    });

    it('should return 404 when user not found or nothing to update', async () => {
      req.params.id = '1';
      req.body = { username: 'new' };
      vi.mocked(adminService.updateUserById).mockResolvedValue(false);

      await handleUpdateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found or nothing to update'
      });
    });

    it('should return 500 on service error', async () => {
      req.params.id = '1';
      req.body = { username: 'new' };
      vi.mocked(adminService.updateUserById).mockRejectedValue(new Error('fail'));

      await handleUpdateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to update user'
      });
    });
  });
});