import { Response, Request } from 'express';
import {
  vehicleCreateValidator,
  vehicleGetValidator,
} from './vehicleValidatorHandler';
import { ValidationError } from 'yup';

jest.mock('../../common/logs/pino');

function mockResponse() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return response;
}

describe('Test vehicleValidatorHandler', function () {
  test('Create request formatted correctly', async function () {
    // Arrange
    const mockReq = {
      body: {
        make: 'BMW',
        model: '120i',
        state: 'available',
      },
    } as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await vehicleCreateValidator(mockReq, mockRes as unknown as Response, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });

  test('Get request formatted correctly', async function () {
    // Arrange
    const mockReq = {
      params: {
        vehicleId: 123,
      },
      query: {
        timestamp: '2024-04-28',
      },
    } as unknown as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await vehicleGetValidator(mockReq, mockRes as unknown as Response, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });

  test('Get request formatted correctly without timestamp', async function () {
    // Arrange
    const mockReq = {
      params: {
        vehicleId: 123,
      },
    } as unknown as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await vehicleGetValidator(mockReq, mockRes as unknown as Response, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });

  test('Create request missing make value', async function () {
    // Arrange
    const mockReq = {
      body: {
        make: '',
        model: '120i',
        state: 'available',
      },
    } as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await expect(async () => {
      await vehicleCreateValidator(mockReq, mockRes as unknown as Response, next);
    }).rejects.toThrow(ValidationError);
  });

  test('Create request missing model value', async function () {
    // Arrange
    const mockReq = {
      body: {
        make: 'BMW',
        model: '',
        state: 'available',
      },
    } as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await expect(async () => {
      await vehicleCreateValidator(mockReq, mockRes as unknown as Response, next);
    }).rejects.toThrow(ValidationError);
  });

  test('Create request missing state value', async function () {
    // Arrange
    const mockReq = {
      body: {
        make: 'BMW',
        model: '120i',
        state: '',
      },
    } as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await expect(async () => {
      await vehicleCreateValidator(mockReq, mockRes as unknown as Response, next);
    }).rejects.toThrow(ValidationError);
  });

  test('Get request missing vehicleId value', async function () {
    // Arrange
    const mockReq = {
      params: {
        vehicleId: 0,
      },
      query: {
        timestamp: '2024-04-28',
      },
    } as unknown as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await expect(async () => {
      await vehicleGetValidator(mockReq, mockRes as unknown as Response, next);
    }).rejects.toThrow(ValidationError);
  });

  test('Get request invalid timestamp value', async function () {
    // Arrange
    const mockReq = {
      params: {
        vehicleId: 123,
      },
      query: {
        timestamp: '2024-04-32',
      },
    } as unknown as Request;

    const mockRes = mockResponse();
    const next = jest.fn();

    // Act
    await expect(async () => {
      await vehicleGetValidator(mockReq, mockRes as unknown as Response, next);
    }).rejects.toThrow(ValidationError);
  });
});
