import { EncounterDto } from './EncounterDto';
import { PokemonStatDto } from './PokemonStatDto';

export class PokemonDto {
    id: string;
    name: string;
    types: string[];   
    stats: PokemonStatDto[];
    encounters: EncounterDto[];
}   