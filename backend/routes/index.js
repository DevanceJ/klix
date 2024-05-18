import express from "express";
import pingRouter from "./pingRouter.js";

const router = express.Router();

router.use(pingRouter);

export default router;
