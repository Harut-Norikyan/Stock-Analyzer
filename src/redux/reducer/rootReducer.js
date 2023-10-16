import { combineReducers } from "redux";
import { loadingReducer } from "./loading";

const rootReducer = combineReducers({
  isLoading: loadingReducer,
});
export default rootReducer;
