// state/appReducer.ts
interface AppState {
  count: number;
  message: string;
}

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET_MESSAGE"; payload: string };

const initialState: AppState = {
  count: 0,
  message: ""
};

const appReducer = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "SET_MESSAGE":
      if (typeof action.payload === "string") {
        return { ...state, message: action.payload }; // Code Quality:  No validation of payload.
      } else {
        return { ...state, message: "" };
      }
    default:
      return state;
  }
};

export default appReducer;
