export default class StateUtils {

  static setStateDeep = (state, value, path) => {
    const key = path[0];
    const nextPath = path.slice(1);

    const embeddedValue = nextPath.length
      ? StateUtils.setStateDeep(state[key], value, nextPath)
      : value;

    if (Array.isArray(state)) {
      return state.map((item, index) => (
        (index === key) ? embeddedValue : item
      ));
    }

    return {
      ...state,
      [key]: embeddedValue
    };
  }
}
