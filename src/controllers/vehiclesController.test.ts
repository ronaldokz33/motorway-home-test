import Vehicle from '../models/vehicle';
import { Response } from 'express';
import { Request } from 'express-jwt';
import * as vehicleService from '../services/vehicleService';
import * as vehiclesController from './vehiclesController';

jest.mock('../common/logs/pino');
jest.mock('../services/vehicleService');
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

const mockedCreateVehicle = jest.mocked(vehicleService.CreateVehicle);
const mockedGetVehicle = jest.mocked(vehicleService.GetVehicle);
const mockedGetVehicleStateByDate = jest.mocked(vehicleService.GetVehicleStateByDate);

function mockResponse() {
    const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    return response;
}

describe("Test vehiclesController", function () {
    test("Get vehicle endpoint with value", async function () {
        //Arrange
        const mockReq = {
            params: {
                vehicleId: 3,
            },
            query: {
                timestamp: new Date(),
            }
        } as unknown as Request;

        const mockVehicle: Vehicle = new Vehicle(3, 'BMW', '120i', 'sold');
        const mockRes = mockResponse();

        mockedGetVehicleStateByDate.mockResolvedValueOnce(mockVehicle);

        //Act
        await vehiclesController.Get(mockReq, mockRes as unknown as Response);

        //Assert
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
    });

    test("Get vehicle endpoint with no vehicle found", async function () {
        //Arrange
        const mockReq = {
            params: {
                vehicleId: 5,
            },
            query: {
                timestamp: new Date(),
            }
        } as unknown as Request;

        const mockRes = mockResponse();

        mockedGetVehicleStateByDate.mockResolvedValueOnce(null);

        //Act
        await vehiclesController.Get(mockReq, mockRes as unknown as Response);

        //Assert
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalled();
    });

    test("Get vehicle endpoint without timestamp", async function () {
        //Arrange
        const mockReq = {
            params: {
                vehicleId: 3,
            }
        } as unknown as Request;

        const mockVehicle: Vehicle = new Vehicle(3, 'BMW', '120i', 'sold');
        const mockRes = mockResponse();

        mockedGetVehicle.mockResolvedValueOnce(mockVehicle);

        //Act
        await vehiclesController.Get(mockReq, mockRes as unknown as Response);

        //Assert
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalled();
    });

    test("Post vehicle endpoint with success", async function () {
        //Arrange
        const mockReq = {
            body: {
                make: 'BMW',
                model: '120i',
                state: 'available'
            }
        } as unknown as Request;

        const mockVehicle: Vehicle = new Vehicle(5, 'BMW', '120i', 'available');
        const mockRes = mockResponse();

        mockedCreateVehicle.mockResolvedValueOnce(mockVehicle);

        //Act
        await vehiclesController.Post(mockReq, mockRes as unknown as Response);

        //Assert
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalled();
    });

    test("Post vehicle endpoint without success", async function () {
        //Arrange
        const mockReq = {
            body: {
                make: 'BMW',
                model: '120i',
                state: 'available'
            }
        } as unknown as Request;

        const mockVehicle: Vehicle = new Vehicle(5, 'BMW', '120i', 'available');
        const mockRes = mockResponse();

        mockedCreateVehicle.mockResolvedValueOnce(null);

        //Act
        await vehiclesController.Post(mockReq, mockRes as unknown as Response);

        //Assert
        expect(mockRes.status).toHaveBeenCalledWith(422);
        expect(mockRes.json).toHaveBeenCalled();
    });
});