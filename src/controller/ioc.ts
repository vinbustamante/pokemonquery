import { Container } from "inversify";
import { types as controllerTypes } from "./types";
import { QueryController } from "./QueryController";

export function configureCommandControllers(container: Container): Container {
  const controllers = [QueryController];
  container.bind<any[]>(controllerTypes.Commands).toConstantValue(controllers);
  controllers.forEach(controller => {
    container.bind<any>(controller).to(controller);
  });
  return container;
}
