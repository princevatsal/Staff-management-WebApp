import React, { createContext, useReducer } from "react";
import { SET_USER, UNSET_USER } from "./types";
import { userReducer } from "./reducers";
import axios from "axios";
const initialState = {
  userData: null,
};

// Global User Context
export const UserContext = createContext();

// Global User Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUserData = (userData) => {
    dispatch({ type: SET_USER, payload: userData });
  };

  const unsetUserData = () => {
    dispatch({ type: UNSET_USER, payload: initialState });
  };

  const checkUserData = () => {
    if (localStorage.token && !state.userData) {
      axios.get("/getUserInfoByToken").then((data) => {
        dispatch({ type: SET_USER, payload: data.data });
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData: state.userData,
        setUserData,
        unsetUserData,
        checkUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
