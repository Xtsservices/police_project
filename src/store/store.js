// store.js
import { createStore } from "redux";

const initialData = {
  currentUserData: null,
};

function Reducer(state = initialData, action) {
  switch (action.type) {
    case "currentUserData":
      return { ...state, currentUserData: action.payload };
    default:
      return state;
  }
}

const store = createStore(Reducer);
export default store;
export const dispatch = store.dispatch;
