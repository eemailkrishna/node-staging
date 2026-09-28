import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateUserCreate, validateUserUpdate } from '../middleware/validateUser.js';

const router = Router();

router.get('/', userController.list);
router.post('/', validateUserCreate, userController.create);
router.get('/:id', userController.getById);
router.put('/:id', validateUserUpdate, userController.update);
router.delete('/:id', userController.remove);

export default router;
