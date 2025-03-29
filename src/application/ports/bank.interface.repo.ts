import { IBank } from '../domain/bank';

export interface IBankRepository {
  createBank(user: IBank): Promise<IBank>;
  findById(id: string): Promise<IBank | null>;
  seedBankCollection(): Promise<null>;
}
