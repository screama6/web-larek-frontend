import {Component} from "./base/Component";
import {ItemCategory} from "../types";
import {bem, ensureElement} from "../utils/utils";
import clsx from "clsx";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description?: string;
    image?: string;
    price: number;
    id?: string;
    index?: string;
    category?: T;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._index = container.querySelector(`.basket__item-index`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set index(value: string) {
        this.setText(this._index, value);
    }

    get index(): string {
        return this._index.textContent || '';
    }

    set price(value: string) {
        if(value === null) {
            value = '0'
        }
        this.setText(this._price, `${value} синапсов`);
    }

    get price(): string {
        return this._price.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
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

    buttonDeleteInBasket (value: string) {
        this.setText(this._button, value);
    }
}


export class CatalogItem<T> extends Card<T> {

    protected _category?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);

        this._category = container.querySelector(`.card__category`);
    }

    protected _categoryColor = <Record<string, string>> { // опсания категории
        "софт-скил": "soft",
        "другое": "other",
        "дополнительное": "additional",
        "кнопка": "button",
        "хард-скил": "hard"
      }

    set category(category: ItemCategory) {
        this.setText(this._category, category);
        this.toggleClass(this._category, `card__category_${this._categoryColor[category]}`, true)
    };
};