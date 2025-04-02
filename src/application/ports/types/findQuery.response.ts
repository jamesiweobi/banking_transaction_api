export interface IFindQueryResponse<T> {
  data: T[];
  total: number;
  pagination?: {
    limit: number;
    skip: number;
    page: number;
    totalPages: number;
  };
}
