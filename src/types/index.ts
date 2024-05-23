export type ItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';

export interface IProductItem {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: ItemCategory;
  price: number;
};

export interface IProductsData {
  cards: IProductItem[];
  preview: string | null;
  setCatalog(items: IProductItem[]): IProductItem;
  setPreview(item: IProductItem) : IProductItem;
}

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;

export interface IBasketModal{
  items: IBasketItem[];
  add(items: IBasketItem): void;
  remove(item: IBasketItem): void;
  getTotalPrice(): number;
  clearBasket(): void;
}

export type PaymentMethod = Pick<IOrder, 'payment'>;

export interface IOrder{
  payment: string;
  total: number;
  items: string[];
  email: string;
  phone: string;
  address: string;
};

export type IOrderForm = Pick<IOrder, 'payment' | 'address'>;

export type IUserForm = Pick<IOrder, 'email' | 'phone'>;

export type IResultForm = Pick<IOrderResult, 'total'>;

export interface IOrderResult {
  id: string;
  total: number;
};

export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;
export type UserFormErrors = Partial<Record<keyof IUserForm, string>>;