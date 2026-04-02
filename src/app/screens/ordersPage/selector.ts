import {createSelector} from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootState) => state.ordersPage;


export const retrievePausedOrders = createSelector(
    selectOrdersPage,
    (OrdersPage) => OrdersPage.pausedOrders

)

export const retrieveProcessOrders = createSelector(
    selectOrdersPage,
    (OrderPage) => OrderPage.processOrders,

)
export const retrieveFinishedOrders = createSelector(
    selectOrdersPage,
    (OrdersPage) => OrdersPage.finishedOrders,

)