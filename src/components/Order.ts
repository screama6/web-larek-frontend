import {Form} from "./common/Form";
import {IOrderForm, IUserForm} from "../types";
import {IEvents} from "./base/events";
import {ensureAllElements} from "../utils/utils";

export type TabActions = {
    onClick: (name: string) => void
}

export class Order extends Form<IOrderForm>{

    protected _buttons?: HTMLButtonElement[];
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions?: TabActions) {
        super(container, events);

       this._buttons = ensureAllElements<HTMLButtonElement>(`.button_alt`, container);

       this._buttons.forEach(button => {
        button.addEventListener('click', () => {
            actions?.onClick?.(button.name);
        })
       })
       
    }

    set paymentMethod(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name)
            this.setDisabled(button, button.name === name)

        })
    }

    set adress(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}


export class User extends Form<IUserForm> {

 

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}