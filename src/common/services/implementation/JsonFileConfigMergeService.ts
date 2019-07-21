import { injectable, inject } from "inversify";
import { IJsonFileConfigMergeService } from "../IJsonFileConfigMergeService";
import { IFileService } from "../IFileService";
import { IFlowService } from "../IFlowService";
import { IReflectionService } from "../IReflectionService";
import { types as serviceTypes } from "../types";

@injectable()
export class JsonFileConfigMergeService implements IJsonFileConfigMergeService {
  @inject(serviceTypes.IFileService)
  private readonly _fileService: IFileService;

  @inject(serviceTypes.IFlowService)
  private readonly _flowService: IFlowService;

  @inject(serviceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  async merge(files: string[]): Promise<object> {
    let mergeConfig: any = {};
    const contents = await this._readFiles(files);
    contents.forEach(content => {
      const config = this._reflectionService.toObject(content);
      mergeConfig = Object.assign(mergeConfig, config);
    });
    return mergeConfig;
  }

  private _readFiles(files: string[]): Promise<string[]> {
    const readFile = this._fileService.read.bind(this._fileService);
    return this._flowService.each(files, readFile);
  }
}
