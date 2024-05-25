import { Api, ApiListResponse } from './base/Api';
import {IBasketItem, IBasketModal, IOrder, IOrderForm, IOrderResult, IProductItem, IUserForm} from "../types";

export interface IProductAPI {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    orderProduct: (orderForm: IOrderForm, userForm: IUserForm, basketModal: IBasketModal) => Promise<IOrderResult>;
}

export class ProductAPI extends Api implements IProductAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (item: IProductItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getProductList(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProduct(orderForm: IOrderForm, userForm: IUserForm, basketModel: IBasketModal ): Promise<IOrderResult> {
        
        let items: IBasketItem[] = []
        basketModel.items.forEach((item) => {
            if(item.price === null){
                basketModel.remove(item)
            } else {
                items.push(item)
            }
        })
        
        const order: IOrder = {
            address: orderForm.address,
            payment: orderForm.payment,
            email: userForm.email,
            phone: userForm.phone,
            total: basketModel.getTotalPrice(),
            items: items.map((item) => item.id)
    }
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}