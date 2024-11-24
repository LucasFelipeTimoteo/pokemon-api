import { Router } from "express";

const router = Router();
router.get("/health", (_, res) => {
	res.sendStatus(200);
});

export const healthRouter = router;
