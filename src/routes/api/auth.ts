import { Router } from 'express';
import Login from '../../controllers/authController';

const router = Router();

router.post('/', Login);

export default router;
