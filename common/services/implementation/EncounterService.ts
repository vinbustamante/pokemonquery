import { injectable, inject } from 'inversify';
import { EncounterDto } from '../dto/EncounterDto';
import { IEncounterService } from '../IEncounterService';
import { types as repositoryTypes } from '../../repositories/types';

@injectable()
export class EncounterService implements IEncounterService {

    @inject(repositoryTypes.IEncounterRepository)
    private readonly _encounterRepository;

    getById(id: string): Promise<EncounterDto[]> {
        return this._encounterRepository.getById(id);
    }    
}