import * as _ from "underscore";
import { injectable, inject, Container } from "inversify";
import { types as serviceTypes } from "../types";
import { types as controllerTypes } from "../../../controller/types";
import { IUtilService } from "../IUtilService";

@injectable()
export class UtilService implements IUtilService {
  @inject(serviceTypes.Container)
  private readonly _container: Container;

  getControllerByCommand(cmd: string): any {
    let controller;
    const controllers = this._container.get<object[]>(controllerTypes.Commands);
    if (controllers) {
      const controllerClass: any = controllers.find((c: any) => {
        const supportedCommands = c.__command__ || [];
        return _.findWhere(supportedCommands, { cmd: cmd }) !== undefined;
      });
      if (controllerClass) {
        controller = this._container.get<any>(controllerClass);
      }
    }
    return controller;
  }
}
