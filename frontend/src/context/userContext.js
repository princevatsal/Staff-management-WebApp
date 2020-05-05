import React, { createContext, useReducer } from "react";
import { SET_USER, UNSET_USER, SET_DATE } from "./types";
import { userReducer } from "./reducers";
import axios from "axios";
const initialState = {
  userData: null,
  dates: { date: new Date(), show: "Today" },
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
    dispatch({ type: UNSET_USER });
  };

  const setDate = (date) => {
    dispatch({ type: SET_DATE, payload: date });
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
        dates: state.dates,
        setUserData,
        unsetUserData,
        checkUserData,
        setDate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
