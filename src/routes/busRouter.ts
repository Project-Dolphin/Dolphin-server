import express, { NextFunction, Request, Response } from 'express';
import { BUS_STOP_ID, BUS_STOP_NAME } from '../constants/busService';
import { busServiceNew } from '../service/BusServiceNew';
import { BusServiceV3 } from '../service/BusServiceV3';

const router = express.Router();

router.get('/nearest-station', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // gpsx = latitude, gpsy = longitude
  const { latitude, longitude } = req.query ?? {};

  try {
    if (latitude && longitude) {
      const busTime = await busServiceNew.getNearest190(Number(latitude), Number(longitude));
      return res.status(200).json(busTime);
    }
    return res.status(401).send('latitude, longitude is required.');
  } catch (err) {
    next(err);
  }
});

router.get('/time', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const busStopName = req.query.busStopName?.toString() ?? '';
  const busNumber = req.query.busNumber?.toString() ?? '';

  try {
    if (busStopName && busNumber) {
      if (!Object.values(BUS_STOP_NAME).includes(busStopName)) {
        return res.status(401).send('busStopName is invalid.');
      }
      if (!Object.keys(BUS_STOP_ID).includes(busNumber)) {
        return res.status(401).send('busNumber is invalid.');
      }
      const busTime = await busServiceNew.getSpecificNode(busStopName, busNumber);
      return res.status(200).json(busTime);
    }
    return res.status(401).send('busStopName and busNumber is required.');
  } catch (err) {
    next(err);
  }
});

router.get('/info', async (req: Request, res: Response) => {
  const busNumber = req.query.busNumber?.toString() ?? '';

  try {
    if (busNumber) {
      if (!Object.keys(BUS_STOP_ID).includes(busNumber)) {
        return res.status(401).send('busNumber is invalid.');
      }
      const busTime = await busServiceNew.getBusInfoByRouteId(busNumber);
      return res.status(200).json(busTime);
    }
    return res.status(401).send('busNumber is required.');
  } catch (err) {
    return res.status(402).send(err);
  }
});

router.get('/departbus', async (req: Request, res: Response) => {
  try {
    const busTime = await busServiceNew.getNextDepartBus();
    return res.status(200).json(busTime);
  } catch (err) {
    return res.status(402).send(err);
  }
});

router.get('/nextshuttle', async (req: Request, res: Response) => {
  try {
    const busTime = await busServiceNew.getNextShuttle();
    return res.status(200).json(busTime);
  } catch (err) {
    return res.status(402).send(err);
  }
});


router.get('/nextshuttle', async (req: Request, res: Response) => {
  try {
    const busTime = await busServiceNew.getNextShuttle();
    return res.status(200).json(busTime);
  } catch (err) {
    return res.status(402).send(err);
  }
});


router.get('/local-test', async (req: Request, res: Response) => {
  try {
    const busTime = await new BusServiceV3().getDepartBusTime();
    return res.status(200).json(busTime);
  } catch (err) {
    return res.status(402).send(err);
  }
});

export const busRouter = router;
