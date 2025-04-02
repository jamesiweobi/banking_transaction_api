import { ILedgerEntry } from '../domain/ledgerEntry';

export interface ILedgerEntryRepository {
  createBank(bank: ILedgerEntry): Promise<ILedgerEntry>;
  findById(id: string): Promise<ILedgerEntry | null>;
  findByName(id: string): Promise<ILedgerEntry | null>;
}
