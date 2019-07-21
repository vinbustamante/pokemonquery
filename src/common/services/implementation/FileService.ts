import * as fs from "fs";
import { injectable, inject } from "inversify";
import { FileAccessException } from "../exception/FileAccessException";
import { IFileService } from "../IFileService";
import { IReflectionService } from "../IReflectionService";
import { types as serviceTypes } from "../types";

@injectable()
export class FileService implements IFileService {
  @inject(serviceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  read(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, content) => {
        if (err) {
          reject(new FileAccessException(err.message));
        } else {
          resolve(content.toString());
        }
      });
    });
  }

  write(file: string, content: any): Promise<any> {
    const contentString = this._reflectionService.toJson(content);
    return new Promise((resolve, reject) => {
      fs.writeFile(file, contentString, err => {
        if (err) {
          reject(err);
        } else {
          resolve(contentString);
        }
      });
    });
  }
}
