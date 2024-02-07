import { spider } from "./spider";

const url = process.argv[2];

if (!url) {
  console.error("You must provide a URL as an argument!");
  process.exit(1);
}

spider(url, (err, filename, downloaded) => {
  if (err) {
    console.error(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
