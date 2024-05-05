import {OrderFormErrors, UserFormErrors, IBasketItem, IOrder, IOrderForm, IProductItem, IProductsData, IUserForm} from "../types";
import { IEvents } from "./base/events";
import {Model} from "./base/Model";

export class ProductItem extends Model<IProductItem> { 
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number;
}


export class ProductData extends Model<IProductsData> {
  cards: ProductItem[];
  /*orderForm: IOrderForm = {
    paymentMethod: undefined,
    address: ''
  }
  userForm: IUserForm = {
    email: '',
    phone: ''
  }*/
  preview: string | null;
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

/*setOrderField(field: keyof IOrderForm, value: string) {
    this.userForm[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.orderFrom);
    }
}*/

  /*validateOrder() {
    const errors: typeof this.orderFormErrors = {};
    if (!this.orderForm.paymentMethod) {
        errors.paymentMethod = 'Необходимо выбрать способ оплаты';
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
    this.events.emit('orderFormErrors:change', this.orderFormErrors);
    return Object.keys(errors).length === 0;
  }*/

 /* set cards(cards:IProductItem[]) {
      this._cards = cards;
      this.events.emit('cards:changed')
  }

  get cards () {
      return this._cards;
  }*/

 /* getCard(cardId: string) {
      return this.cards.find((item) => item.id === cardId)
  }*/
/*
  set preview(cardId: string | null) {
    if (!cardId) {
        this._preview = null;
        return;
    }
    const selectedCard = this.getCard(cardId);
    if (selectedCard) {
        this._preview = cardId;
        this.events.emit('card:selected')
    }
  }

    get preview () {
        return this._preview;
    }*/

   
}
/*
export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: LotItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleOrderedLot(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false);
            this.catalog.find(it => it.id === id).clearBid();
        });
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setCatalog(items: ILot[]) {
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: LotItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    getActiveLots(): LotItem[] {
        return this.catalog
            .filter(item => item.status === 'active' && item.isParticipate);
    }

    getClosedLots(): LotItem[] {
        return this.catalog
            .filter(item => item.status === 'closed' && item.isMyBid)
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}*/