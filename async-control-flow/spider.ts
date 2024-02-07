import fs from "fs";
import path from "path";
import superagent from "superagent";
import { mkdirp } from "mkdirp";
import { urlToFilename } from "./utils.js";

export type CallbackFn = (
  err: Error | null,
  data?: string,
  downloaded?: boolean,
) => void;

export function spider(url: string, cb: CallbackFn) {
  const filename = urlToFilename(url);
  fs.access(filename, (err) => {
    if (!err || err.code !== "ENOENT") {
      return cb(null, filename, false);
    }

    console.log(`Downloading ${url} into ${filename}`);
    download(url, filename, (err) => {
      if (err) {
        return cb(err);
      }

      cb(null, filename, true);
    });
  });
}

function download(url: string, filename: string, cb: CallbackFn) {
  console.log(`Downloading ${filename}`);
  superagent.get(url).end(async (err, res) => {
    if (err) {
      return cb(err);
    }

    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }

      console.log(`Downloaded and saved: ${url}`);
      cb(null, res.text);
    });
  });
}

function saveFile(filename: string, html: string, cb: CallbackFn) {
  const folder = mkdirp.sync(path.dirname(filename));

  if (folder) {
    fs.writeFile(filename, html, cb);
  }
}
