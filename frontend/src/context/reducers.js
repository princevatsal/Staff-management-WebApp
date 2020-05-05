import { SET_USER, UNSET_USER, SET_DATE } from "./types";

export const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, userData: action.payload };

    case UNSET_USER:
      return { ...state, userData: null };

    case SET_DATE:
      return {
        ...state,
        dates: {
          date: action.payload,
          show: action.payload.toLocaleDateString(),
        },
      };
    default:
      return state;
  }
};
