export interface IPokemonService {
    getById(id: string): Promise<any>;
    getByName(name: string): Promise<any>;
}