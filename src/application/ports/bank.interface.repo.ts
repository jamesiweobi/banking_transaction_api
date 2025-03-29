import { IBank } from '../domain/bank';

export interface IBankRepository {
  createBank(bank: IBank): Promise<IBank>;
  findById(id: string): Promise<IBank | null>;
  findByName(id: string): Promise<IBank | null>;
  seedBankCollection(banks: IBank[]): Promise<void>;
}
