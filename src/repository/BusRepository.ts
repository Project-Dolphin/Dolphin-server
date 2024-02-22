export interface BusTime {
    busType: string;
    operationType: string;
    // destination: string;
    from: string;
    to: string;
    time: string;
}

export interface BusTimeTableRepository {
    findAll<T>(path: string): Promise<T[]>
    save<T>(path: string, busTime: T): Promise<T>
}