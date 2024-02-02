import fs from "fs";

// synchronous CPS (Continuation-Passing Style)
function add(a: number, b: number, cb: (data: number | string) => void) {
  cb(a + b);
}

console.log("print 1");

add(2, 2, (result) => console.log(`the sum is: ${result}`));
console.log("print 2");

// async CPS
function asyncLog(result: string | number) {
  setTimeout(() => console.log(result));
}

console.log("print 1");

add(2, 2, (result) => asyncLog(result));
console.log("print 2");

function handleError(err: Error) {
  console.error(err.message);
}

// Error comes first
fs.readFile("", { encoding: "utf8" }, (err, data) => {
  if (err) {
    handleError(err);
  } else {
    console.log(data);
  }
});

// Error propagation
function readJSON(
  filename: string,
  cb: (err: Error | null, data?: string) => void,
) {
  fs.readFile(filename, "utf8", (err, data) => {
    let parsed;
    if (err) {
      // propagate just the error, return from the function
      return cb(err);
    }

    try {
      parsed = JSON.parse(data);
      // not calling cb here to avoid catching errors from the execution of the cb itself
    } catch (err) {
      const error = err as Error;
      // propagate parsing errors
      return cb(error);
    }

    // pass just the data to the callback
    cb(null, parsed);
  });
}

console.log(process.cwd());

readJSON("callbacks-and-events/myjsonfile.json", (_, data) => {
  console.log(data);
});
