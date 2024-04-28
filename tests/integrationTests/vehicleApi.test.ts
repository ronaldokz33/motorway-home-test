import { Get } from './common/request';

describe('Test vehicles', () => {
    it('Get vehicle by id', async () => {
        //Arrange
        //Act
        const res = await Get('vehicle/3');

        //Assert
        expect(res.status).toBe(200);

        expect(res.data.body.id).toBe(3);
        expect(res.data.body.state).toBe('sold');
    });

    it('Get vehicle by id and timestamp', async () => {
        //Arrange
        //Act
        const res = await Get(`vehicle/3?timestamp=${encodeURI('2022-09-12 10:00:00+00')}`);

        //Assert
        expect(res.status).toBe(200);

        expect(res.data.body.id).toBe(3);
        expect(res.data.body.state).toBe('selling');
    });
});