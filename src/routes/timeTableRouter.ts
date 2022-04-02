import express from 'express';
import { busService } from '../service/BusService';
import { shuttleService } from '../service/ShuttleService';

const router = express.Router();

router.get('/190', async (req, res) => {
  const businfo = await busService.getDepart190();
  return res.status(200).json(businfo);
});

router.get('/shuttle', async (req, res) => {
  const shuttleInfo = await shuttleService.getAllShuttle();
  return res.status(200).json(shuttleInfo);
});

export const timeTableRouter = router;
