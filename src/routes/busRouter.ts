import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error("bus error");
  } catch(err) {
    next(err);
  }
});

export const busRouter = router;
