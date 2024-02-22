import { UnivBusParsingTask } from "../tasks/UnivBusParsingTask";
import { BusTimeTableRepositoryImpl } from "./BusTimeTableRepositoryImpl";

(async () => {
    // const db = new JsonDB(new Config('OceanView', true, true, '/', false));

    const repository = new BusTimeTableRepositoryImpl();

    const univBusParsingTask = new UnivBusParsingTask(repository);

    await univBusParsingTask.run();
})();