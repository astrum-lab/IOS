let defaultState = {
  token: "",
  user: {},
  route: "",
};

const reducer = (state = defaultState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: payload,
      };
    case "SET_ROUTE":
      return {
        ...state,
        route: payload,
      };

    default:
      return state;
  }
};

export default reducer;
