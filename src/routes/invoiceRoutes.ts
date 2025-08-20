import { Router } from 'express';
import auth from '../middleware/auth';
import { generateInvoice } from '../controllers/invoiceController';

const router = Router();

router.post('/generate', auth, generateInvoice);

export default router;