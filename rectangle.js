// A first class function is when you can store in avariable and use it like any other variable
// A callback fu♂ction takes two parameters first one is the error and the second one is the return value
// If there is error in callback as a frist parameter, the second paramter will be null or vice versa.
module.exports = (x, y, callback) => {
  if (x <= 0 || y <= 0) {
    setTimeout(
      () =>
        callback(
          new Error(`Rectangle dimensions should be greater than zero : length = ${x} and breadth = ${y}`),
          null
        ),
      2000
    );
  } else {
    setTimeout(
      () =>
        callback(null, {
          // perimeter: (x, y) => 2 * (x + y),
          // we don't need to pass x,y parameters as they are retreived from top
          perimeter: () => 2 * (x + y),
          area: () => x * y,
        }),
      2000
    );
  }
};
