import {OrderFormErrors, UserFormErrors, IOrder, IOrderForm, IProductItem, IProductsData, IUserForm, IBasketModal} from "../types";
import {Model} from "./base/Model";
import {BasketModal } from "./Basket";

export class ProductItem extends Model<IProductItem> { 
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number;
}


export class AppState extends Model<IProductsData> {
  cards: ProductItem[];
  orderForm: IOrderForm = {
    payment: '',
    address: ''
  }
  userForm: IUserForm = {
    email: '',
    phone: ''
  }
  preview: string | null;
  basketModal: IBasketModal = new BasketModal();
  orderFormErrors: OrderFormErrors = {};
  userFormErrors: UserFormErrors = {};

 
  
  setCatalog(items: IProductItem[]) {
    this.cards = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('items:changed', { cards: this.cards });
  }
  setPreview(item: ProductItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }


setOrderField(field: keyof IOrderForm, value: string) {
    this.orderForm[field] = value;
    if (this.validateOrder()) {
        this.events.emit('order:ready', this.orderForm);
    }
}

setUserField(field: keyof IUserForm, value: string) {
    this.userForm[field] = value;

    if (this.validateUser()) {
        this.events.emit('order:ready', this.userForm);
    }
}

  validateOrder() {
    const errors: typeof this.orderFormErrors = {};
    if (!this.orderForm.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.orderForm.address) {
        errors.address = 'Необходимо указать адрес';
    }
    this.orderFormErrors = errors;
    this.events.emit('orderFormErrors:change', this.orderFormErrors);
    return Object.keys(errors).length === 0;
  }

  validateUser() {
    const errors: typeof this.userFormErrors = {};
    if (!this.userForm.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.userForm.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.userFormErrors = errors;
    this.events.emit('userFormErrors:change', this.userFormErrors);
    return Object.keys(errors).length === 0;
  }
}