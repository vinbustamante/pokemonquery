import { injectable, inject } from "inversify";
import * as os from "os";
import { IFlowService } from "../IFlowService";
import { types as serviceTpes } from "../types";

@injectable()
export class FlowService implements IFlowService {
  private _parallelCount: number;

  @inject(serviceTpes.AsyncLib)
  private readonly _asyncLib: any;

  async each(items: any[], handler, parallelCount?: number): Promise<any[]> {
    parallelCount = parallelCount || this._getDefaultParallelCount();
    return new Promise((resolve, reject) => {
      const results = [];
      this._asyncLib.eachOfLimit(
        items,
        parallelCount,
        (item, index, callback) => {
          handler(item)
            .then(response => {
              results[index] = response;
              callback();
            })
            .catch(err => {
              callback(err);
            });
        },
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  private _getDefaultParallelCount(): number {
    if (this._parallelCount === undefined) {
      this._parallelCount = os.cpus().length;
    }
    return this._parallelCount;
  }
}
