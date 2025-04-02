import mongoose from 'mongoose';
import { ILedgerEntry } from '../domain/ledgerEntry';

export interface ILedgerEntryRepository {
  createLedgerEntry(bank: ILedgerEntry, session: mongoose.ClientSession): Promise<ILedgerEntry>;
  findById(id: string): Promise<ILedgerEntry | null>;
  findByName(id: string): Promise<ILedgerEntry | null>;
}
