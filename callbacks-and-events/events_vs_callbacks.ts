import { EventEmitter } from "stream";

function helloEvents() {
  const emitter = new EventEmitter();
  setTimeout(() => {
    emitter.emit("complete", "hello world");
  }, 100);
  return emitter;
}

function helloCallback(cb: (err: Error | null, data: string) => void) {
  setTimeout(() => {
    cb(null, "hello world");
  }, 100);
}

helloEvents().on("complete", (message) => console.log(message));
helloCallback((_, message) => console.log(message));

// Choose callbacks when there is only one event
// Choose events where there are multiple events

// Choose callbacks when the cb is expected to be called exactly once
// Choose events when the cb may be invoked multiple times or not invoked at all

// Callbacks can notify only 1 cb
// Events can notify multiple listeners
