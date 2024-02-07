import { spider2 } from "./spider-2";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) ?? 1;

if (!url) {
  console.error("You must provide a url");
} else {
  spider2(url, nesting, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log("Download complete");
  });
}
