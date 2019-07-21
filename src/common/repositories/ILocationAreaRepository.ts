export interface ILocationAreaRepository {
  getById(id: string): Promise<any>;
}
