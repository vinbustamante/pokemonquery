export interface IJsonFileConfigMergeService {
  merge(files: string[]): Promise<object>;
}
