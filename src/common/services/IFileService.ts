export interface IFileService {
  read(file: string): Promise<string>;
  write(file: string, content: any): Promise<string>;
}
