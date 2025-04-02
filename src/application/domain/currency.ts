export interface ICurrency {
  _id?: string;
  code: String;
  name: String;
  symbol: String;
  decimalPlaces: Number;
  isFiat: Boolean;
}
