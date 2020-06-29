
const defaultState = {
  counter: 0,
  message: 'here is the message'
};

const counter = (state = defaultState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        counter: state.counter + 1
      }
    default:
      return state
  }
}

export default counter