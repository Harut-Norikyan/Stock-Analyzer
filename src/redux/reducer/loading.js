import { actions_types } from "../constants/action_type";

const initialState = {
  isLoading: false,
};
export const loadingReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions_types.LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    default:
      return state;
  }
};
