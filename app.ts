import "reflect-metadata";
import { Container } from 'inversify';
import { IUtilService } from './src/common/services/IUtilService';
import { types as serviceTypes } from './src/common/services/types';
import { configureCommonServices } from './src/common/services/ioc';
import { configureCommonRepositories } from './src/common/repositories/ioc';
import { configureCommandControllers } from './src/controller/ioc';

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('query', 'get an information about the pokemon')
    .demandCommand(1, 'action command needed')
    .options({
        f: {
            alias:     'field',
            default:   'name',
            describe:  'field name to use for querying the pokemon data'
        }
    })
    .choices('f', ['id', 'name'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2019')
    .argv;

const [command, queryValue] = argv._;
const queryField = argv.field;

let container = new Container();
configureCommonServices(container);
configureCommonRepositories(container);
configureCommandControllers(container);

const utilService = container.get<IUtilService>(serviceTypes.IUtilService);
const commandController = utilService.getControllerByCommand(command);
if (commandController) {
    commandController.execute({
        cmd: command,
        queryField: queryField,
        queryValue: queryValue
    })
    .then(response => {
        console.log(JSON.stringify(response));
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });    
}