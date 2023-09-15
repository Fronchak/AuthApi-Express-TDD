import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', (req, res) => res.status(200).json());

export default authRoutes;
