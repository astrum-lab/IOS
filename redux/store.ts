import { createStore } from "redux";

import reducer from "./reducers/index";

export default function configureStore(initialState: any) {
  return createStore(reducer, initialState);
}
