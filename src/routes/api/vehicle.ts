import { Router } from 'express';
import * as vehiclesController from '../../controllers/vehiclesController';
import authHandler from '../../middleware/auth/authHandler';
import {
  vehicleCreateValidator,
  vehicleGetValidator,
} from '../../middleware/validators/vehicleValidatorHandler';

const router = Router();

router.get('/:vehicleId', vehicleGetValidator, vehiclesController.Get);

router.post('/', authHandler, vehicleCreateValidator, vehiclesController.Post);

export default router;
