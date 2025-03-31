export interface IBank {
  _id?: string;
  bankName: string;
  sortCode: string;
  bankCode: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}
