import { EventEmitter } from "events";

function ticker(time: number, cb: (tickCount: number) => void) {
  const eventEmitter = new EventEmitter();
  let tickCount = 0;

  while (time > 0) {
    setTimeout(() => {
      eventEmitter.emit("tick", 50);
    });
    time -= 50;

    tickCount++;
  }

  cb(tickCount);
  return eventEmitter;
}

// should log 10
ticker(500, (tickCount) => {
  console.log(tickCount);
}).on("tick", () => console.log("tick"));
