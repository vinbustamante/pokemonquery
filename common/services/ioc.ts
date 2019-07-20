import { Container } from 'inversify';

import { types as commonServiceTypes } from './types';
import IDateService from './IDateService';
import DateService from './implementation/DateService';

export function configureCommonServices(container: Container): Container {
    container.bind<IDateService>(commonServiceTypes.IDateService).to(DateService).inSingletonScope();
    return container;
}