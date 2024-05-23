import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { IBasketModal,IBasketItem} from "../../types";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
    title: string;
    price: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
        console.log(this._total.textContent)
            if(this._total.textContent === '0 синапсов'){
                this.setDisabled(this._button, true)
            } else {
                this.setDisabled(this._button, false)
            }
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._button, true)
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, String(`${total} синапсов`));
    }
}

export class BasketModal implements IBasketModal {
    items: IBasketItem[] = [];

    add(item: IBasketItem) {
        console.log(this.items)
        if (!this.items.some(it => it.id === item.id)) {
            this.items.push(item);
        }
       
    }
    
    remove(item: IBasketItem) {
        this.items = this.items.filter(it => it.id !== item.id);
    }

    getTotalPrice() {
        let result = 0
        this.items.forEach(el=> result += el.price);
        return result
      }

    clearBasket(): void {
        this.items = []
    }
}