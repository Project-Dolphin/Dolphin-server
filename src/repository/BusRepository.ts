export interface BusTime {
    busType: string;
    operationType: string;
    // destination: string;
    from: string;
    to: string;
    time: string;
}

export interface BusTimeTableRepository {
    findAll(): Promise<BusTime[]>
    save(busTime: BusTime): Promise<BusTime>
}