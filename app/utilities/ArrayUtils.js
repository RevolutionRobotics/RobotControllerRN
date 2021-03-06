export default class ArrayUtils {

  static chunk = (array, size) => {
    return array.reduce((chunkedArray, item, index) => {
      if (index % size === 0) {
        chunkedArray.push([]);
      }

      chunkedArray[chunkedArray.length - 1].push(item);
      return chunkedArray;
    }, []);
  }

  static all = array => array.every(condition => condition);
  static none = array => array.every(condition => !condition);
}
