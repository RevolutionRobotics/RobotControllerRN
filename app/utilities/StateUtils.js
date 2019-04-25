export default class StateUtils {

  static setStateDeep(state, value, path) {
    let newPath = [...path]; // ES6 destructuring
    const key = newPath.shift();

    const embeddedValue = newPath.length
      ? StateUtils.setStateDeep(state[key], value, newPath)
      : value;

    if (Array.isArray(state)) {
      return [
        ...state.slice(0, key),
        embeddedValue,
        ...state.slice(key + 1)
      ];
    }

    return {
      ...state,
      [key]: embeddedValue
    };
  }
}
