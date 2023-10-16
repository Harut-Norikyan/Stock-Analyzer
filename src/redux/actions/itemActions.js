import { actions_types } from "../constants/action_type";

export const setIsLoading = (payload) => {
  return {
    type: actions_types.LOADING,
    payload,
  };
};
