import { UnivBusParsingTask } from "../tasks/UnivBusParsingTask";
import { BusTimeTableRepositoryImpl } from "./BusTimeTableRepositoryImpl";
import { JsonDB, Config } from "node-json-db";

(async () => {
    const db = new JsonDB(new Config('OceanView', true, true, '/', false));
    await db.push('/test', { test: [], time: 10 });
    console.log(await db.getObject('/test'));
    console.log(await db.getObject('/test/time'));
    const repository = new BusTimeTableRepositoryImpl();
    await repository.init();
    await repository.save({
        time: '21:51',
        busType: 'UNIV',
        operationType: 'NORMAL',
        from: '해양대',
        to: '하리',
    });
    await repository.save({
        time: '21:53',
        busType: 'UNIV',
        operationType: 'NORMAL',
        from: '해양대',
        to: '하리',
    });
    await repository.save({
        time: '21:55',
        busType: 'UNIV',
        operationType: 'NORMAL',
        from: '해양대',
        to: '하리',
    });

    const univBusParsingTask = new UnivBusParsingTask(repository);

    await univBusParsingTask.run();

    const result = await repository.findAll();
    console.log(result);
})();