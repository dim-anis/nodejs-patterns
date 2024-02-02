import { EventEmitter } from "events";
import fs from "fs";

class FindRegex extends EventEmitter {
  re: RegExp;
  files: string[];
  constructor(re: RegExp) {
    super();
    this.re = re;
    this.files = [];
  }

  addFile(filename: string) {
    this.files.push(filename);
    return this;
  }

  find() {
    // a sync event won't register unless wrapped in .nextTick()
    // because async event are guaranteed to not fire until next tick, so that
    // we don't miss any events
    process.nextTick(() => this.emit("started", this.files.toString()));

    for (const file of this.files) {
      fs.readFile(file, "utf8", (err, content) => {
        if (err) {
          this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.re);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }

    return this;
  }
}

const findHelloWorld = new FindRegex(/hello \w+/i);
findHelloWorld
  .addFile("callbacks-and-events/hello.txt")
  .addFile("callbacks-and-events/world.txt")
  .find()
  .on("started", (files) => console.log(`Started searching for ${files}`))
  .on("found", (file, elem) => console.log(`Found ${elem} in ${file}`))
  .on("error", (err) => console.error(`Error emitted ${err.message}`));
