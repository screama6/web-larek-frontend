import {Component} from "./base/Component";
import {IProductItem} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}


export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement
    protected _description?: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}`);
        this._description = container.querySelector(`.${blockName}__description`);

       /* if(this._button) {
            this._button.addEventListener('click', () => {
                events.emit('card: open')
            })
        } else { console.log(1)}*/
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
                console.log(1)
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string) {
        this.setText(this._price, value);
    }

    get price(): string {
        return this._price.textContent || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}


export class CatalogItem<T> extends Card<T> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}