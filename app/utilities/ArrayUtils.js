export default class ArrayUtils {

  static chunk(array, size) {
    const chunkedArray = [];

    let copied = [...array]; // ES6 destructuring
    const numOfChild = Math.ceil(copied.length / size);

    for (let i = 0; i < numOfChild; i++) {
      chunkedArray.push(copied.splice(0, size));
    }
    
    return chunkedArray;
  };
}
