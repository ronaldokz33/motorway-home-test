import {
  GetVehicleStateByDate,
  GetVehicle,
  CreateVehicle,
} from './vehicleService';
import redis from '../common/cache/redis';
import * as vehicleRepository from '../common/db/vehicleRepository';
import GetLogsByVehicleIdAndDate from '../common/db/stateLogRepository';
import VehicleDto from '../models/dto/vehicleDto';
import StateLogDto from '../models/dto/stateLogDto';
import Vehicle from '../models/vehicle';
import VehicleRequest from '../models/request/vehicleRequest';

jest.mock('../common/cache/redis');
jest.mock('../common/db/vehicleRepository');
jest.mock('../common/db/stateLogRepository');

jest.mock('pg', () => {
    return {
        Pool: jest.fn(() => ({
            connect: jest.fn(),
            query: jest.fn(),
            on: jest.fn(),
            once: jest.fn()
        })),
    };
});

jest.mock('redis', () => {
    return {
        createClient: jest.fn(() => ({
            connect: jest.fn(),
            on: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        })),
    };
});


const mockedRedisGet = jest.mocked(redis.get);
const mockedRedisSet = jest.mocked(redis.set);
const mockedVehicleRepositoryGetById = jest.mocked(vehicleRepository.GetById);
const mockedVehicleCreateVehicle = jest.mocked(vehicleRepository.CreateVehicle);
const mockedstateLogRepositoryGetByVehicleId = jest.mocked(
  GetLogsByVehicleIdAndDate,
);

describe('Test vehicleService', function () {
  test('Get vehicle by id from cache', async function () {
    // Arrange
    const mockResponse: VehicleDto = new VehicleDto(
      1,
      'BMW',
      '120i',
      'available',
    );
    mockedRedisGet.mockResolvedValueOnce(JSON.stringify(mockResponse));

    // Act
    const response = await GetVehicle(1);

    // Assert
    expect(response?.Id).toBe(mockResponse.Id);
    expect(response?.Make).toBe(mockResponse.Make);
    expect(response?.Model).toBe(mockResponse.Model);
    expect(response?.State).toBe(mockResponse.State);
    expect(mockedRedisSet).not.toHaveBeenCalled();
    expect(mockedVehicleRepositoryGetById).not.toHaveBeenCalled();
  });

  test('Get vehicle by id and state by timestamp from cache', async function () {
    // Arrange
    const mockResponse: VehicleDto = new VehicleDto(
      1,
      'BMW',
      '120i',
      'selling',
    );
    mockedRedisGet.mockResolvedValueOnce(JSON.stringify(mockResponse));

    // Act
    const response = await GetVehicleStateByDate(1, new Date());

    // Assert
    expect(response?.Id).toBe(mockResponse.Id);
    expect(response?.Make).toBe(mockResponse.Make);
    expect(response?.Model).toBe(mockResponse.Model);
    expect(response?.State).toBe(mockResponse.State);
    expect(mockedRedisSet).not.toHaveBeenCalled();
    expect(mockedVehicleRepositoryGetById).not.toHaveBeenCalled();
  });

  test('Get vehicle by id and state by timestamp from db', async function () {
    // Arrange
    const mockResponse: VehicleDto = new VehicleDto(
      1,
      'BMW',
      '120i',
      'available',
    );
    const mockStateLogResponse: StateLogDto[] = [
      new StateLogDto(1, 'selling', new Date()),
    ];

    mockedRedisGet.mockResolvedValueOnce(null);
    mockedVehicleRepositoryGetById.mockResolvedValueOnce(mockResponse);
    mockedstateLogRepositoryGetByVehicleId.mockResolvedValueOnce(
      mockStateLogResponse,
    );

    // Act
    const response = await GetVehicleStateByDate(1, new Date());

    // Assert
    expect(response?.Id).toBe(mockResponse.Id);
    expect(response?.Make).toBe(mockResponse.Make);
    expect(response?.Model).toBe(mockResponse.Model);
    expect(response?.State).toBe('selling');
    expect(mockedRedisSet).toHaveBeenCalled();
    expect(mockedVehicleRepositoryGetById).toHaveBeenCalled();
    expect(mockedstateLogRepositoryGetByVehicleId).toHaveBeenCalled();
  });

  test('Get vehicle by id from db', async function () {
    // Arrange
    const mockResponse: VehicleDto = new VehicleDto(
      1,
      'BMW',
      '120i',
      'available',
    );
    mockedRedisGet.mockResolvedValueOnce(null);
    mockedVehicleRepositoryGetById.mockResolvedValueOnce(mockResponse);

    // Act
    const response = await GetVehicle(1);

    // Assert
    expect(response).toBeInstanceOf(Vehicle);
    expect(response?.Id).toBe(mockResponse.Id);
    expect(response?.Make).toBe(mockResponse.Make);
    expect(response?.Model).toBe(mockResponse.Model);
    expect(response?.State).toBe(mockResponse.State);
    expect(mockedRedisSet).toHaveBeenCalled();
  });

  test('Create vehicle', async function () {
    // Arrange
    const mockResponse: VehicleDto = new VehicleDto(
      1,
      'BMW',
      '120i',
      'available',
    );

    const mockRequest: VehicleRequest = new VehicleRequest(
      'BMW',
      '120i',
      'available',
    );

    mockedVehicleCreateVehicle.mockResolvedValueOnce(mockResponse);

    // Act
    const response = await CreateVehicle(mockRequest);

    // Assert
    expect(response).toBeInstanceOf(Vehicle);
    expect(response?.Id).toBeGreaterThan(0);
    expect(response?.Make).toBe(mockRequest.Make);
    expect(response?.Model).toBe(mockRequest.Model);
    expect(response?.State).toBe(mockRequest.State);
  });
});
