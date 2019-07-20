export interface IDateService {
    getCurrentDate(): Date;
    timespanToSeconds(timespan: string): number;
    getCurrentTimestamp(): number;
}