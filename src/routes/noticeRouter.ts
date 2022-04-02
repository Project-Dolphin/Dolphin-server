import express from 'express';
import { noticeService } from '../service/NoticeService';

const router = express.Router();

router.get('/', async (req, res) => {
  const notices = await noticeService.getAcademicNotice();
  return res.status(200).json(notices);
});

export const noticeRouter = router;
