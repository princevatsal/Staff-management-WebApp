import React, { createContext, useReducer } from "react";
import { SET_USER, UNSET_USER } from "./types";
import { userReducer } from "./reducers";
// Global User Context
export const UserContext = createContext();

const initialState = {
  userData: null,
};

// Global User Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const setGlobalUser = (userData) => {
    dispatch({ type: SET_USER, payload: userData });
  };

  const unsetGlobalUser = () => {
    dispatch({ type: UNSET_USER, payload: initialState });
  };

  return (
    <UserContext.Provider
      value={{
        userData: state.userData,
        setGlobalUser,
        unsetGlobalUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
