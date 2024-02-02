const LANGUAGES = ["en", "es"];

const selected_language = process.argv[2];

if (!LANGUAGES.includes(selected_language)) {
  console.error("Language is not supported");
  process.exit(1);
}

const module_to_load = `./hw_in_${selected_language}.js`;

import(module_to_load).then((strings) => console.log(strings.HELLO));
