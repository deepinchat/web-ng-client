import { Router } from "express";
import { chatRouter } from "./chat.route";

const router = Router();

router.use('/chats', chatRouter);

export default router;