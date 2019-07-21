import { EncounterDto } from "./dto/EncounterDto";

export interface IEncounterService {
  getById(id: string): Promise<EncounterDto[]>;
}
