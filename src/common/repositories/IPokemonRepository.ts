export interface IPokemonRepository {
  getRecord(value: string): Promise<any>;
}
