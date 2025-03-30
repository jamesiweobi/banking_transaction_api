export interface IBank {
  id?: string;
  bankName: string;
  sortCode: string;
  bankCode: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}
