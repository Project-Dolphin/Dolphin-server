import express, { NextFunction, Request, Response } from 'express';
import { BusType, busService } from '../service/BusServiceV3';


const router = express.Router();

function convertBusType(type: string) {
    switch (type) {
        case 'UNIV':
            return BusType.UNIV;
        case 'CITY':
            return BusType.CITY;
        default:
            return BusType.CITY;
    }
}
router.get('/schedules', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const busType = req.query.type ? convertBusType(req.query.type as string) : BusType.CITY;
        const busStop = req.query.busStop ? req.query.busStop as string : '';
        const result = await busService.findAllBus(busType, busStop);

        console.log('result = ', result);
        return res.json(result);
    } catch (err) {
        next(err);
    }
});



export const busRouterV2 = router;
