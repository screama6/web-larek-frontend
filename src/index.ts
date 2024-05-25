import './scss/styles.scss';
import {ProductAPI} from "./components/ProductAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/Events"
import {AppState, ProductItem} from "./components/AppState"
import {Modal} from "./components/common/Modal";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Page} from "./components/Page";
import {CatalogItem} from "./components/Card";
import {Basket, BasketModal} from "./components/Basket";
import {OrderForm, ContactsForm} from "./components/Order";
import {IOrderForm, IUserForm, PaymentMethod} from './types';
import {Success} from "./components/Success";

const api = new ProductAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


const appState = new AppState({}, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const userFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const success = new Success(cloneTemplate(successTemplate), {
  onClick: () => {
      modal.close();
      events.emit('basket:change');
  }
});

const basket = new Basket(cloneTemplate(basketTemplate), events);

const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events, {
  onClick: (name) => {
    events.emit('orderPayment:change', {field: 'payment', name: name});
  }
});
const userForm = new ContactsForm(cloneTemplate(userFormTemplate), events);

events.on('items:changed', () => {
  page.catalog = appState.cards.map(item => {
      const card = new CatalogItem (cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:open', item)
    });
   
      return card.render({
          title: item.title,
          image: item.image,
          price: item.price,
          category: item.category,
          id: item.id
      });
  });
});

events.on('orderPayment:change', (data: { field: keyof IOrderForm, name: keyof PaymentMethod}) => {
  orderForm.render({
      payment: `${data.name}`,
            valid: false,
            errors: []
    });
  
  appState.setOrderField(data.field, data.name);
});

events.on('card:open', (item: ProductItem) => {
  appState.setPreview(item);
});

events.on('bids:open', () => {
      modal.render({
          content: basket.render({
          })
      });
    });

events.on('basket:change', () => {
  page.basketCounter = appState.basketModal.items.length;
  basket.total = appState.basketModal.getTotalPrice();
  basket.items = Array.from(appState.basketModal.items).map((basketItem, index) => {
    const item = Array.from(appState.basketModal.items).find(
      (catalogItem) => catalogItem.id === basketItem.id
    );
    const card = new CatalogItem (cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit('removeFromBasket:change', item)
    });
    return card.render({
        index: String(index + 1),
        title: item.title,
        price: item.price
      });
    });
  });

events.on('addInbasket:change', (item: ProductItem) => {
  appState.basketModal.add(item);
  events.emit('basket:change');
  events.emit('preview:changed', item);
});

events.on('removeFromBasket:change', (item: ProductItem) => {
  appState.basketModal.remove(item);
  events.emit('basket:change');
  events.emit('card:changed', item);
});

events.on('card:changed', (item: ProductItem) => {

  let card;
  if(appState.basketModal.items.find((el) => el.id === item.id)){
    card = new CatalogItem (cloneTemplate(cardPreviewTemplate), {
      onClick: () => events.emit('removeInCardFromBasket:change', item)
    });
    card.buttonDeleteInBasket('Удалить из корзины');
  } else {
    card = new CatalogItem (cloneTemplate(cardPreviewTemplate), {
      onClick: () => events.emit('addInbasket:change', item)
    });
  };

    return card.render({
          title: item.title,
          image: item.image,
          description: item.description,
          price: item.price,
          category: item.category,
          id: item.id
        });
});

events.on('removeInCardFromBasket:change', (item: ProductItem) => {
  appState.basketModal.remove(item);
  events.emit('basket:change');
  events.emit('preview:changed', item);
});

events.on('preview:changed', (item: ProductItem) => {

    let card;
    if(appState.basketModal.items.find((el) => el.id === item.id)){
      card = new CatalogItem (cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('removeInCardFromBasket:change', item)
      });
      card.buttonDeleteInBasket('Удалить из корзины');
    } else {
      card = new CatalogItem (cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('addInbasket:change', item)
      });
    };

      modal.render({
          content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            id: item.id
          })
      });
});

events.on('order:open', () => {
  modal.render({
      content: orderForm.render({
          payment: '',
          address: '',
          valid: false,
          errors: []
      })
  });
});

events.on('order:submit', () => {
  modal.render({
    content: userForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
    })
});
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment,address } = errors;
  orderForm.valid = !payment && !address;
  orderForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});

events.on('userFormErrors:change', (errors: Partial<IUserForm>) => {
  const { email, phone } = errors;
  userForm.valid = !email && !phone;
  userForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appState.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IUserForm, value: string }) => {
  appState.setUserField(data.field, data.value);
});

events.on('contacts:submit', () => {
 
  api.orderProduct(appState.orderForm, appState.userForm, appState.basketModal)
      .then((result) => {
          appState.basketModal.clearBasket();
          events.emit('basket:change');

          modal.render({
              content: success.render({
                title: `Списано ${result.total} синапсов`
              })
          });
      })
      .catch(err => {
          console.error(err);
      });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

api.getProductList()
  .then(appState.setCatalog.bind(appState))
  .catch(err => {
    console.error(err);
  });

