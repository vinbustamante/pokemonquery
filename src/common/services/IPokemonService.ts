import { PokemonDto } from "./dto/PokemonDto";

export interface IPokemonService {
  getRecord(value: string): Promise<PokemonDto>;
}
