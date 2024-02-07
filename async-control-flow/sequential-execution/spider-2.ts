import fs from "fs";
import superagent from "superagent";
import { urlToFilename } from "../utils";
import { CallbackFn } from "../spider";
import { mkdirp } from "mkdirp";
import path from "path";
import { getPageLinks } from "./utils";

function spiderLinks(
  currentUrl: string,
  body: string,
  nesting: number,
  cb: (err: Error | null) => void,
) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  function iterate(index: number) {
    if (index === links.length) {
      // no error
      return cb(null);
    }

    const link = links[index];
    if (link) {
      spider2(link, nesting - 1, function (err) {
        if (err) {
          return cb(err);
        }

        iterate(index + 1);
      });
    }
  }

  iterate(0);
}

export function spider2(url: string, nesting: number, cb: CallbackFn) {
  const filename = urlToFilename(url);
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") return cb(err);

      return download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        if (requestContent) {
          spiderLinks(url, requestContent, nesting, cb);
        }
      });
    }

    spiderLinks(url, fileContent, nesting, cb);
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
