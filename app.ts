import "reflect-metadata";
import { Container } from 'inversify';
import { configureCommonServices } from './common/services/ioc';
import { configureCommandControllers } from './controller/ioc';
//@ts-ignore
import controllerTypes from './controller/types';

//@ts-ignore
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
configureCommandControllers(container);

console.log('***************************');
//console.log(container.get<object[]>(controllerTypes.Commands));
//console.log(argv);
console.log('command : ', command);
console.log('queryField : ', queryField);
console.log('queryValue : ', queryValue);
console.log('***************************');


(() => {
    return new Promise(resolve => {
        console.log('on hold');
        setTimeout(() => {
            console.log('done');
            resolve();
        }, 5000);
    });
})()