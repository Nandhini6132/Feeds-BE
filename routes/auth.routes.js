import { Router } from 'express';
import { register, login } from '../controller/auth.controller.js';

const router = Router();
console.log('Rotes');
router.post('/register', register);
router.post('/login', login);
router.get('/test', (req, res) => {
  res.send('Auth routes working');
});

export default router;
