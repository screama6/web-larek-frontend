import './scss/styles.scss';
import {ProductAPI} from "./components/ProductAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events"
import {ProductData, ProductItem} from "./components/AppData"
import {Modal} from "./components/common/Modal";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Page} from "./components/Page";
import {CatalogItem} from "./components/Card";
import {Basket} from "./components/common/Basket";

const api = new ProductAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const productData = new ProductData({}, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');


const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on('items:changed', () => {
  page.catalog = productData.cards.map(item => {
      const card = new CatalogItem (cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card:open', item)
    });
      return card.render({
          title: item.title,
          image: item.image,
          price: `${item.price} синапсов`,
          category: item.category,
          id: item.id
      });
  });

  /*page.counter = appData.getClosedLots().length;*/
});

events.on('card:open', (item: ProductItem) => {
  productData.setPreview(item);
});

events.on('bids:open', (item: ProductItem) => {
  
      const card = new Basket (cloneTemplate(basketTemplate), events);
      modal.render({
          content: card.render({
            /*title: item.title,
            image: item.image,
            description: item.description,
            price: `${item.price} синапсов`,
            category: item.category,
            id: item.id*/
          })
      });
    
    });


events.on('preview:changed', (item: ProductItem) => {
  const showItem = (item: ProductItem) => {
      const card = new CatalogItem (cloneTemplate(cardPreviewTemplate));
      modal.render({
          content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: `${item.price} синапсов`,
            category: item.category,
            id: item.id
          })
      });

      
  };
  if (item) {
    api.getProductItem(item.id)
        .then((result) => {
            item.description = result.description;
            showItem(item);
        })
        .catch((err) => {
            console.error(err);
        })
} else {
    modal.close();
}

});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

api.getProductList()
  .then(productData.setCatalog.bind(productData))
  .catch(err => {
    console.error(err);
  })