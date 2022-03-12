import fs from "fs";

export const getCountryCode = [];

fs.readFile("./data.json", (error, data) => {
  console.log(data);
});
