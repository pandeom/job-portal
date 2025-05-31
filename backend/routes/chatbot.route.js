import express from 'express';
import { chatbotResponse } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/chatbot', chatbotResponse);

export default router;
