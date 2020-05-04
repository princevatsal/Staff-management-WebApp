import React, { createContext, useReducer } from "react";
import {
  SET_USER,
  UNSET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
} from "./types";
import { userReducer } from "./reducers";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
};

// Global User Context
export const UserContext = createContext();

// Global User Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setAuthenticated = () => {
    dispatch({ type: SET_AUTHENTICATED });
  };

  const setUnauthenticated = () => {
    dispatch({ type: SET_UNAUTHENTICATED });
  };

  const setUserCredentials = (userData) => {
    dispatch({ type: SET_USER, payload: userData });
  };

  const unsetUserCredentials = () => {
    dispatch({ type: UNSET_USER, payload: initialState });
  };

  return (
    <UserContext.Provider
      value={{
        user: state,
        setAuthenticated,
        setUnauthenticated,
        setUserCredentials,
        unsetUserCredentials,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
