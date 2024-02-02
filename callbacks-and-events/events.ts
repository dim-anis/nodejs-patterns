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
  .on("found", (file, elem) => console.log(`Found ${elem} in ${file}`))
  .on("error", (err) => console.error(`Error emitted ${err.message}`));
