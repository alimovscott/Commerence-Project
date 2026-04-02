import {createSelector} from "reselect"

import { AppRootState } from "../../../lib/types/screen"

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveAdmin = createSelector(
    selectProductsPage,
    (ProductsPage) => ProductsPage.admin
);


export const retrieveChosenProduct = createSelector(
    selectProductsPage,
    (ProductsPage) => ProductsPage.chosenProduct
);

export const retrieveProducts = createSelector(
    selectProductsPage,
    (ProductsPage) => ProductsPage.products
);
