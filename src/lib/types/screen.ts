import { Member } from "./member";
import { Product } from "./product";
import {Order} from "./order"

/**REACT APP STATE  **/
export interface AppRootState {
    homePage: HomePageState;
    productsPage: ProductsPageState;
    ordersPage: OrdersPageState;
}

//**  <<--    HOMEPAGE  -->   **/
export interface HomePageState {
    popularProducts: Product[];
    newProducts: Product[];
    topUsers: Member[];
}


//**  <<--    PRODUCT PAGE  -->   **/
export interface ProductsPageState {
    admin: Member | null;
    chosenProduct: Product | null;
    products: Product[];

}

//**  <<--    ORDERS PAGE  -->   **/


export interface OrdersPageState{
    pausedOrders: Order[];
    processOrders: Order[];
    finishedOrders: Order[];

}