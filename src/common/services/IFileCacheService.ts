import { FileCacheDto } from "./dto/FileCacheDto";

export interface IFileCacheService {
  get(key: string): Promise<FileCacheDto>;
  set(key: string, content: any): Promise<FileCacheDto>;
}
