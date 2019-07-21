import { Container } from 'inversify';
import * as request from 'request';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as moment from 'moment-timezone';

import { types as commonServiceTypes } from './types';

import { IConfigService } from './IConfigService';
import { ConfigService } from './implementation/ConfigService';

import { IUtilService } from './IUtilService';
import { UtilService } from './implementation/UtilService';

import { IDateService } from './IDateService';
import { DateService } from './implementation/DateService';

import { IHttpService } from './IHttpService';
import { HttpService } from './implementation/HttpService';

import { IReflectionService } from './IReflectionService';
import { ReflectionService } from './implementation/ReflectionService';

import { IPokemonService } from './IPokemonService';
// import { PokemonService } from './implementation/PokemonService';
import { PokemonCacheableService } from './implementation/cacheable/PokemonCacheableService';

import { IEncounterService } from './IEncounterService';
import { EncounterService } from './implementation/EncounterService';

import { IFlowService } from './IFlowService';
import { FlowService } from './implementation/FlowService';

import { IFileService } from './IFileService';
import { FileService } from './implementation/FileService';

import { IJsonFileConfigMergeService } from './IJsonFileConfigMergeService';
import { JsonFileConfigMergeService } from './implementation/JsonFileConfigMergeService';

import { IFileCacheService } from './IFileCacheService';
import { FileCacheService } from './implementation/FileCacheService';

export function configureCommonServices(container: Container): Container {
    container.bind<any>(commonServiceTypes.BashShell).toConstantValue(shell);
    container.bind<any>(commonServiceTypes.RequestLib).toConstantValue(request);
    container.bind<Container>(commonServiceTypes.Container).toConstantValue(container);
    container.bind<any>(commonServiceTypes.DateLib).toConstantValue(moment);
    container.bind<IUtilService>(commonServiceTypes.IUtilService).to(UtilService).inSingletonScope();
    const mergeConfig = _loadFiles();
    const configService = new ConfigService(mergeConfig);
    container.bind<IConfigService>(commonServiceTypes.IConfigService).toConstantValue(configService);
    container.bind<IDateService>(commonServiceTypes.IDateService).to(DateService).inSingletonScope();
    container.bind<IHttpService>(commonServiceTypes.IHttpService).to(HttpService).inSingletonScope();
    container.bind<IReflectionService>(commonServiceTypes.IReflectionService).to(ReflectionService).inSingletonScope();
    container.bind<IPokemonService>(commonServiceTypes.IPokemonService).to(PokemonCacheableService).inSingletonScope();
    container.bind<IEncounterService>(commonServiceTypes.IEncounterService).to(EncounterService).inSingletonScope();
    container.bind<IFlowService>(commonServiceTypes.IFlowService).to(FlowService).inSingletonScope();
    container.bind<IFileService>(commonServiceTypes.IFileService).to(FileService).inSingletonScope();
    container.bind<IJsonFileConfigMergeService>(commonServiceTypes.IJsonFileConfigMergeService).to(JsonFileConfigMergeService).inSingletonScope();
    container.bind<IFileCacheService>(commonServiceTypes.IFileCacheService).to(FileCacheService).inSingletonScope();
    return container;
}

function _loadFiles() {
    //@ts-ignore
    let config = JSON.parse(fs.readFileSync('config/default.json').toString());
    const stage = process.env.stage || 'local';
    const stageFile = `config/${stage}.json`;
    if (fs.existsSync(stageFile)) {
        const stageConfig = JSON.parse(fs.readFileSync(stageFile).toString());
        config = Object.assign(config, stageConfig);
    }
    return config;
}