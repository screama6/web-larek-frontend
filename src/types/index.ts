export interface IProductItem {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: string;
};

export interface IProductsData {
  cards: IProductItem[];
  preview: string | null;
  getCard(cardId: string): IProductItem;
}

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'> & {
  number: number;
};

export type PaymentMethod = 'cash' | 'card' | undefined;

export interface IOrder{
  paymentMethod: PaymentMethod;
  total: number;
  items: string[];
  email: string;
  phone: string;
  address: string;
};

export type IOrderForm = Pick<IOrder, 'paymentMethod' | 'address'>;

export type IUserForm = Pick<IOrder, 'email' | 'phone'>;

export type IResultForm = Pick<IOrderResult, 'total'>;

export interface IOrderResult {
  id: string;
  total: number;
};