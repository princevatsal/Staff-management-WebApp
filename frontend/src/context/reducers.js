import { SET_USER, UNSET_USER } from "./types";

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { userData: action.payload };

    case UNSET_USER:
      return action.payload;

    default:
      return state;
  }
};
