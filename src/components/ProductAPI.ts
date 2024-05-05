import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, IProductItem} from "../types";

export interface IProductAPI {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    /*getOpenProduct: (id: string) => Promise<IProductItem>;*/
    orderProduct: (order: IOrder) => Promise<IOrderResult>;
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

    /*getOpenProduct(id: string): Promise<IProductItem> {
        return this.get(`/product/${id}`).then(
            (data: IProductItem) => data
        );
    }*/

    getProductList(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProduct(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}