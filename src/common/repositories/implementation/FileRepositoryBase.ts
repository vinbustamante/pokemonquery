import { injectable, inject } from "inversify";
import { types as commonServiceTypes } from "../../services/types";
import { IFileService } from "../../services/IFileService";
import { IReflectionService } from "../../services/IReflectionService";

@injectable()
export abstract class FileRepositoryBase {
  @inject(commonServiceTypes.IFileService)
  private readonly _fileService: IFileService;

  @inject(commonServiceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  getById(id: string) {
    return this._fileService.read(`data/id/${id}.json`).then(content => {
      return this._reflectionService.toObject(content);
    });
  }
}
