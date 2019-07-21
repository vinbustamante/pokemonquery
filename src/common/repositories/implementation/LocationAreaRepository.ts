import { injectable } from "inversify";
import { ILocationAreaRepository } from "../ILocationAreaRepository";
import { HttpRepositoryBase } from "./HttpRepositoryBase";
import { HttpMethodEnum } from "../../enum/HttpMethodEnum";

@injectable()
export class LocationAreaRepository extends HttpRepositoryBase
  implements ILocationAreaRepository {
  getById(id: string): Promise<any> {
    return this.request({
      url: `/location-area/${id}`,
      method: HttpMethodEnum.get
    });
  }
}
