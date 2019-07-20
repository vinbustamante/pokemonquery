import { Container } from 'inversify';
import controllerTypes from './types';
import { QueryController } from './QueryController';


export function configureCommandControllers(container: Container): Container {
    const controllers = [
        QueryController
    ];
    container.bind<object[]>(controllerTypes.Commands).toConstantValue(controllers);
    return container;
}