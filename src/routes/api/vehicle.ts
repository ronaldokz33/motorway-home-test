import { Router } from 'express';
import * as vehiclesController from '../../controllers/vehiclesController';
import authHandler from '../../middleware/auth/authHandler';
import {
  vehicleCreateValidator,
  vehicleGetValidator,
} from '../../middleware/validators/vehicleValidatorHandler';
import { tryCatch } from '../../common/utils/utils';

const router = Router();

router.get('/:vehicleId', tryCatch(vehicleGetValidator), tryCatch(vehiclesController.Get));

router.post('/', authHandler, tryCatch(vehicleCreateValidator), tryCatch(vehiclesController.Post));

export default router;
