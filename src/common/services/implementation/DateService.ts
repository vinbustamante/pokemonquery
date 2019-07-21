import { injectable, inject } from 'inversify';
import { types as serviceTypes } from '../types';
import { IDateService } from '../IDateService';

@injectable()
export class DateService implements IDateService {

    private readonly _timespanMap = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400
    };

    @inject(serviceTypes.DateLib)
    private readonly _dateLib: any;

    timespanToSeconds(timespan: string): number {
        let seconds = 0;
        if (timespan) {
            const num = parseInt(timespan, 10);
            const span = timespan.replace(num.toString(), '').trim();
            let multiplier = 1;
            if (span) {
                multiplier = this._timespanMap[span.toLowerCase()] || 0;
            }
            seconds = num * multiplier;
        }
        return seconds;
    }

    getCurrentTimestamp(): number {
        return this._dateLib().unix();
    }
}