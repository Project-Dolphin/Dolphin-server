import { BusTimeTableRepository } from "../repository/BusRepository";
import { JsonDB, Config } from "node-json-db";

export class BusTimeTableRepositoryImpl implements BusTimeTableRepository {
    private db = new JsonDB(new Config('OceanView', true, true, '/', false));

    async findAll<T>(path: string): Promise<T[]> {
        return await this.db.getData('/bus' + path);
    }
    async save<T>(path: string, busTime: T): Promise<T> {
        await this.db.push('/bus' + path, busTime, true);
        return busTime;
    }
}