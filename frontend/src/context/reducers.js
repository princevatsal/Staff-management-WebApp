import {
  SET_USER,
  UNSET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
} from "./types";

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };

    case SET_UNAUTHENTICATED:
      return { ...state, authenticated: false };

    case SET_USER:
      return { ...state, credentials: action.payload };

    case UNSET_USER:
      return action.payload;

    default:
      return state;
  }
};
