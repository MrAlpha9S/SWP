const { vi } = require('vitest');

module.exports = {
    getAllUsers: vi.fn(),
    createUser: vi.fn(),
    getUserById: vi.fn(),
    updateUserById: vi.fn(),
    // Add any other methods your service has
};