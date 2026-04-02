import React, { useEffect } from "react";
import ActiveUsers from "./ActiveUsers";

import Advertisement from "./Advertisement";
import Events from "./Events";
import NewProducts from "./NewProducts";
import PopularProducts from "./PopularProducts";
import FeaturesSection from "./FeaturesSection";

import { useDispatch } from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";


import { CartItem } from "../../../lib/types/search";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { setNewProducts, setPopularProducts, setTopUsers } from "./slice";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts:(data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data:Member[]) => dispatch(setTopUsers(data)),
});


interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage({ onAdd }: HomePageProps) {
  // Selector: Store => Data biz saqlagan datani qabul qiladi STOREdan 
const {setPopularProducts, setNewProducts, setTopUsers} = actionDispatch(useDispatch())


  useEffect(() => {
    // Backend server data request => DATA. backenddan datani oladi
    const product = new ProductService();
    product.getProducts({
      page: 1,
      limit: 4,
      order: "productViews",
      // productCollection: ProductCollection.ACCESSORIES,
    }).then(data => {
      console.log("data passed here",data);
      setPopularProducts(data);
    })
    .catch((err) => console.log(err));


  
    product.getProducts({
      page: 1,
      limit: 4,
      order: "createdAt",
      // productCollection: ProductCollection.ACCESSORIES,
    }).then(data => {
      console.log("data passed here",data);
      setNewProducts(data);
      console.log(setNewProducts(data));
    })
    .catch((err) => console.log(err));

    const member = new MemberService();
    member.getTopUsers()
    .then(data => {
      setTopUsers(data);
    })
    .catch((err) => console.log(err));

  }, []);


  return (
    <div className="w-full min-w-0">
    <FeaturesSection />
    <PopularProducts onAdd={onAdd} />
    <NewProducts onAdd={onAdd} />
    <Advertisement />
    <ActiveUsers />
    <Events />






    </div>
  );
}
