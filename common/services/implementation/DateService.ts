import { injectable } from 'inversify';
const moment = require('moment-timezone');
import IDateService from '../IDateService';

@injectable()
export default class DateService implements IDateService {
    getCurrentDate(): Date {
        return moment(new Date()).utc().toDate();
    }
}