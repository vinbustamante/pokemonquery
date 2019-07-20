export interface IPokemonRepository {
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
}