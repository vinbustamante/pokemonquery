export interface IDateService {
    timespanToSeconds(timespan: string): number;
    getCurrentTimestamp(): number;
}