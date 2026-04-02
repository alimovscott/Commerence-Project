import { useState } from "react";
import { CartItem } from "../../lib/types/search"


const useBasket = () => {
  
  const cartJson: string | null = localStorage.getItem("cartData");
  const currentCart = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);



 const onAdd = (input: CartItem) => {
    const exist: any = cartItems.find((item: CartItem) => item._id === input._id);
    if(exist) {
      const cartUptade = cartItems.map((item: CartItem) =>  item._id === input._id 
      ? {... exist, quantity: exist.quantity + 1} 
      : item
    );
    setCartItems(cartUptade);
    } else {
      const cartUptade = [...cartItems, {...input}]
      setCartItems(cartUptade);
      localStorage.setItem("cartData", JSON.stringify(cartUptade));
    }
  };

  const onRemove = (input: CartItem) => {
   const exist: any = cartItems.find(
    (item: CartItem) => item._id === input._id
    );
    if(exist.quantity === 1) {
        const cartUptade = cartItems.filter((item:CartItem) => item._id !== input._id);
      setCartItems(cartUptade);
      localStorage.setItem("cartData", JSON.stringify(cartUptade));
    } else {
        const cartUptade = cartItems.map((item: CartItem) => 
            item._id === input._id 
        ? {...exist, quantity: exist.quantity - 1} 
        : item
    );
      setCartItems(cartUptade);
      localStorage.setItem("cartData", JSON.stringify(cartUptade));
    }
  };


  const onDelete = (input: CartItem) => {
    const  cartUptade = cartItems.filter(
        (item: CartItem) => item._id !== input._id
    );
      setCartItems(cartUptade);
      localStorage.setItem("cartData", JSON.stringify(cartUptade));
  }

  const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
  }


  return{
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,

  };



};

export default useBasket;