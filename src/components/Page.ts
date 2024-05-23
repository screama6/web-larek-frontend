import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basketCounter: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

    set basketCounter(value: number) {
        this.setText(this._basketCounter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}