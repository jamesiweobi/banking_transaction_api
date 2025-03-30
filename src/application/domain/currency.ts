export interface ICurrency {
  id?: string;
  code: String;
  name: String;
  symbol: String;
  decimalPlaces: Number;
  isFiat: Boolean;
}
