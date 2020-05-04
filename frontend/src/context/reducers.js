import { SET_USER, UNSET_USER } from "./types";

const setGlobalUser = (userData, state) => {
  return {
    userData: userData,
  };
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return setGlobalUser(action.payload, state);

    case UNSET_USER:
      return action.payload;
    default:
      return state;
  }
};
