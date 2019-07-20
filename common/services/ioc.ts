import { Container } from 'inversify';
import * as request from 'request';

import { types as commonServiceTypes } from './types';

import { IConfigService } from './IConfigService';
import { ConfigService } from './implementation/ConfigService';

import { IUtilService } from './IUtilService';
import { UtilService } from './implementation/UtilService';

import IDateService from './IDateService';
import DateService from './implementation/DateService';

import { IHttpService } from './IHttpService';
import { HttpService } from './implementation/HttpService';

import { IReflectionService } from './IReflectionService';
import { ReflectionService } from './implementation/ReflectionService';

import { IPokemonService } from './IPokemonService';
import { PokemonService } from './implementation/PokemonService';

export function configureCommonServices(container: Container): Container {
    container.bind<any>(commonServiceTypes.RequestLib).toConstantValue(request);
    container.bind<Container>(commonServiceTypes.Container).toConstantValue(container);
    container.bind<IUtilService>(commonServiceTypes.IUtilService).to(UtilService).inSingletonScope();
    container.bind<IConfigService>(commonServiceTypes.IConfigService).to(ConfigService).inSingletonScope();
    container.bind<IDateService>(commonServiceTypes.IDateService).to(DateService).inSingletonScope();
    container.bind<IHttpService>(commonServiceTypes.IHttpService).to(HttpService).inSingletonScope();
    container.bind<IReflectionService>(commonServiceTypes.IReflectionService).to(ReflectionService).inSingletonScope();
    container.bind<IPokemonService>(commonServiceTypes.IPokemonService).to(PokemonService).inSingletonScope();
    return container;
}