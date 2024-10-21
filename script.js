console.log("Polyfills in JavaScript");
const arr = [1, 2, 3, 4];

// Polyfill for map()
// Original map() function --> Array.map((item,index,arr)=>{ logic })

Array.prototype.myMap = function (cb) {
  let newArr = [];

  for (let i = 0; i < this.length; i++) {
    newArr.push(cb(this[i], i, this));
  }

  return newArr;
};

// Testing map polyfill

const multiplyByTwo = arr.myMap((item, index, arr) => {
  return item * 2;
});

console.log("Testing Map Polyfill", multiplyByTwo);

// Polyfill for filter()
// Original filter() function --> Array.filter((item,index,arr)=>{ condition })

Array.prototype.myFilter = function (cb) {
  let newArr = [];

  for (let i = 0; i < this.length; i++) {
    if (cb(this[i], i, this)) {
      newArr.push(this[i]);
    }
  }

  return newArr;
};

// Testing filter polyfill

const greaterThanTwo = arr.myFilter((item, index, arr) => {
  return item > 2;
});

console.log("Testing Filter Polyfill", greaterThanTwo);

// Polyfill for reduce()
// Original reduce() function --> Array.reduce((accumulator,current,index,arr)=>{ logic for computaion },initital value of accumulator)

Array.prototype.myReduce = function (cb, initialVal) {
  let result = initialVal;

  for (let i = 0; i < this.length; i++) {
    result = result ? cb(result, this[i], this) : this[i];
  }

  return result;
};

// Testing reduce polyfill

const sumOfArr = arr.myReduce((acc, curr, arr) => {
  return acc + curr;
}, 0);

console.log("Testing Reduce Polyfill", sumOfArr);

// Polyfill for once()

function myOnce(func, context) {
  let ran;

  return function () {
    if (func) {
      ran = func.apply(context || this, arguments);
      func = null;
    }
    return ran;
  };
}

// Testing once polyfill

const hello = myOnce((a, b) => console.log("Hello", a, b));

hello(1, 2);
hello(1, 2);
hello(1, 2);

// Polyfill for memoize()

function myMemoize(fn, context) {
  const result = {};

  return function (...args) {
    var argsCache = JSON.stringify(args);
    if (!res[argsCache]) {
      res[argsCache] = fn.call(context || this, ...args);
    }
    return res[argsCache];
  };
}

// Currying

function evaluate(operation) {
  return function (num1) {
    return function (num2) {
      if (operation === "sum") return num1 + num2;
      else if (operation === "multiply") return num1 * num2;
      else if (operation === "divide") return num1 / num2;
      else if (operation === "subtract") return num1 - num2;
      else return "Invalid";
    };
  };
}

console.log(evaluate("a")(6)(2));

// Infinite Currying

function add(a) {
  return function (b) {
    if (b) return add(a + b);
    return a;
  };
}

console.log(add(1)(2)(3)(4)(5)());

// Polyfill for call()
// Original call() function --> function.call(obj,argument1,argument2,...)

Function.prototype.myCall = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error(this + "It's not callable");
  }

  context.fn = this;
  context.fn(...args);
};

// Polyfill for apply()
// Original apply() function --> function.apply(obj,[argument1,argument2,...])

Function.prototype.myApply = function (context = {}, args = []) {
  if (typeof this !== "function") {
    throw new Error(this + "It's not callable");
  }

  if (!Array.isArray(args)) {
    throw new Error("Arguments should be an array");
  }

  context.fn = this;
  context.fn(...args);
};

// Polyfill for bind()
// Original bind() function --> function.bind(obj,argument1,argument2,...) --> returns a function

Function.prototype.myBind = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new Error(this + "Cannot be bound as it's not callable");
  }

  context.fn = this;
  return function (...newArgs) {
    return context.fn(...args, ...newArgs);
  };
};

// Polyfill for Promise
// Original Promise function --> const pr = new Promise((resolve,reject) => {})

function PromisePolyfill(executor) {
  let onResolve,
    onReject,
    isFulfilled = false,
    isRejected = false,
    isCalled = false,
    value;

  function resolve(val) {
    isFulfilled = true;
    value = val;
    if (typeof onResolve === "function") {
      onResolve(val);
      isCalled = true;
    }
  }

  function reject(val) {
    isRejected = true;
    value = val;

    if (typeof onReject === "function") {
      onReject(val);
      isCalled = true;
    }
  }

  this.then = function (callback) {
    onResolve = callback;

    if (isFulfilled && !isCalled) {
      isCalled = true;
      onResolve(value);
    }

    return this;
  };

  this.catch = function (callback) {
    onReject = callback;

    if (isRejected && !isCalled) {
      isCalled = true;
      onReject(value);
    }

    return this;
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// Testing Promise Polyfill

const examplePromise = new PromisePolyfill((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 1000);
});

examplePromise
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// Polyfill for Promise.all()
// Original Promise.all function --> Promise.all([p1,p2,p3,...]) --> returns array of fulfilled promises else throws error if any one error occurs

PromisePolyfill.all = (promises) => {
  let fulfilledPromises = [],
    result = [];

  function executor(resolve, reject) {
    promises.forEach((promise, index) =>
      promise
        .then((val) => {
          fulfilledPromises.push(true);
          result[index] = val;

          if (fulfilledPromises.length === promises.length) {
            return resolve(result);
          }
        })
        .catch((error) => {
          return reject(error);
        })
    );
  }
  return new PromisePolyFill(executor);
};

// Polyfill for Promise.race()

function promiseRace(promisesArray) {
  return new Promise((resolve, reject) => {
    promisesArray.forEach((promise) => {
      promise
        .then(resolve) // resolve outer promise, as and when any of the input promise resolves
        .catch(reject); // reject outer promise, as and when any of the input promise rejects
    });
  });
}

// Polyfill for Promise.allSettled()

function allSettled(promises) {
  let mappedPromises = promises.map((p) => {
    return p
      .then((value) => {
        return {
          status: "fulfilled",
          value,
        };
      })
      .catch((reason) => {
        return {
          status: "rejected",
          reason,
        };
      });
  });
  return Promise.all(mappedPromises);
}

// Polyfill for Promise.any()

function any(promises) {
  let results = [];
  var counter = 0;

  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then((result) => {
        resolve(result);
      }).catch((err) => {
        results.push(err);
        ++counter;
        if (counter === promises.length) {
          reject(results);
        }
      });
    });
  });
}

// Debounce example

const btn = document.querySelector(".increment_btn");
const btnPress = document.querySelector(".increment_pressed");
const count = document.querySelector(".increment_count");

var pressedCount = 0;
var triggerCount = 0;

const myDebounce = (cb, d) => {
  let timer;

  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, d);
  };
};

const debouncedCount = myDebounce(() => {
  triggerCount += 1;
  count.innerHTML = triggerCount;
}, 800);

btn.addEventListener("click", () => {
  btnPress.innerHTML = ++pressedCount;
  debouncedCount();
});

// Throttle example

const throttleBtn = document.querySelector(".throttle_increment_btn");
const throttleBtnPress = document.querySelector(".throttle_increment_pressed");
const throttleCount = document.querySelector(".throttle_increment_count");

var pressedThrottleCount = 0;
var triggerThrottleCount = 0;

const myThrottle = (cb, d) => {
  let last = 0;

  return function (...args) {
    let now = new Date().getTime();

    if (now - last < d) return;
    last = now;
    return cb(...args);
  };
};

const throttledCount = myThrottle(() => {
  triggerThrottleCount += 1;
  throttleCount.innerHTML = triggerThrottleCount;
}, 800);

throttleBtn.addEventListener("click", () => {
  throttleBtnPress.innerHTML = ++pressedThrottleCount;
  throttledCount();
});
