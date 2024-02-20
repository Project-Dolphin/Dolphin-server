import { BusTime } from "../repository/BusRepository";
import { JsonDB, Config } from "node-json-db";

export class BusTimeTableRepositoryImpl implements BusTimeTableRepositoryImpl {
    private db = new JsonDB(new Config('OceanView', true, true, '/', false));

    async init() {
        await this.db.delete('/bus');
    }

    async findAll(): Promise<BusTime[]> {
        return await this.db.getData('/bus');
    }
    async save(busTime: BusTime): Promise<BusTime> {
        await this.db.push('/bus[]', busTime, true);
        return busTime;
    }
}