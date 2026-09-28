import { Router } from 'express';
import * as helloController from '../controllers/hello.controller.js';

const router = Router();

router.get('/', helloController.root);
router.get('/hello', helloController.hello);

export default router;
