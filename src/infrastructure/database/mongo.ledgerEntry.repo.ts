import mongoose from 'mongoose';
import LedgerEntryModel from './schemas/ledgerEntry.schema';
import { IFindQueryResponse } from '../../application/ports/types/findQuery.response';
import { ILedgerEntryRepository } from '../../application/ports/ledgerEntry.interface.repo';
import { ILedgerEntry } from '../../application/domain/ledgerEntry';

export class MongoLedgerRepository implements ILedgerEntryRepository {
  async createLedgerEntry(transaction: Partial<ILedgerEntry>, session: mongoose.ClientSession): Promise<ILedgerEntry> {
    const newLedgerEntry = new LedgerEntryModel(transaction);
    const savedLedgerEntry = await newLedgerEntry.save({ session });
    return savedLedgerEntry.toObject() as unknown as ILedgerEntry;
  }

  async findById(id: string): Promise<ILedgerEntry | null> {
    const ledgerEntry = await LedgerEntryModel.findById(id);
    return ledgerEntry ? (ledgerEntry.toObject() as unknown as ILedgerEntry) : null;
  }

  async findBy(
    query: mongoose.FilterQuery<ILedgerEntry>,
    options: mongoose.QueryOptions<ILedgerEntry>,
  ): Promise<IFindQueryResponse<ILedgerEntry>> {
    const { limit, sort, skip } = options;
    const [data, total] = await Promise.all([
      LedgerEntryModel.find(query).limit(limit!).skip(skip!).sort(sort!).exec(),
      LedgerEntryModel.countDocuments(query),
    ]);
    const page = Math.floor(skip! / limit!) + 1;
    const totalPages = Math.ceil(total / limit!);
    return {
      data: data.map((ledgerEntry) => ledgerEntry.toObject() as unknown as ILedgerEntry),
      total,
      pagination: {
        limit: limit!,
        skip: skip!,
        page,
        totalPages,
      },
    };
  }
}
