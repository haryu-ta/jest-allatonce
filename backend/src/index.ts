import { createApp } from "./app";

let app;

if (process.env.DATA_PATH) {
  const data_path = process.env.DATA_PATH;
  app = createApp(`${data_path}/groups.json`, `${data_path}/expenses.json`);
} else {
  throw new Error();
}

app.listen(3000, () => {
  console.log("Start on port 3000");
});
