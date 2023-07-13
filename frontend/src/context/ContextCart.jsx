import PropTypes from "prop-types";
import { createContext, useReducer } from "react";

export const CartContext = createContext();
export const ContextCart = (props) => {
  const reducer = (state = { cartItems: [] }, action) => {
    const existItem = state.cartItems.find(
      (item) => item.id === action.payload.id
    );
    switch (action.type) {
      case "ADD":
        if (existItem) {
          return {
            ...state,
            cartItems: state.cartItems.map((item) =>
              item.id === existItem.id ? action.payload : item
            ),
          };
        } else {
          return { ...state, cartItems: [...state.cartItems, action.payload] };
        }
      case "REMOVE":
        return {
          ...state,
          cartItems: state.cartItems.filter((x) => x.id !== action.payload.id),
        };
      default:
        return state;
    }
  };

  const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

  const [state, dispatch] = useReducer(reducer, {
    cartItems: cartItemsFromStorage,
  });
  const cartList = { state, dispatch };
  localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  return (
    <CartContext.Provider value={cartList}>
      {props.children}
    </CartContext.Provider>
  );
};

ContextCart.propTypes = {
  children: PropTypes.node.isRequired,
};
