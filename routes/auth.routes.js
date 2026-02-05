import { Router } from 'express';
import { register, login, refreshToken } from '../controller/auth.controller.js';

const router = Router();
console.log('Rotes');
router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken',refreshToken)
router.get('/test', (req, res) => {
  res.send('Auth routes working');
});

export default router;
