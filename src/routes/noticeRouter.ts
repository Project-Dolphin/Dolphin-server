import express, { Request, Response } from 'express';
import { noticeService } from '../service/NoticeService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const notices = await noticeService.getAcademicNotice();
  return res.status(200).json(notices);
});

export const noticeRouter = router;
