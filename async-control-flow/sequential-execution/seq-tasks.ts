function task1(cb: () => void) {
  setTimeout(() => {
    task2(cb);
  });
}

function task2(cb: () => void) {
  setTimeout(() => {
    task3(cb);
  });
}

function task3(cb: () => void) {
  setTimeout(() => {
    cb();
  });
}

task1(() => console.log("All tasks completed"));
