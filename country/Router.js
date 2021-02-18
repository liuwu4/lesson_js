const express = require("express");
const fs = require("fs");
const iconv = require("iconv-lite");
const app = express();
const port = 3000;
const axios = require("axios");
const { extractProvincetr } = require("./Include");

const base = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/`;
const init = axios.create({
  baseURL: base,
  headers: {
    Accept: "text/html",
  },
  responseType: "stream",
});
app.use(express.static("index.html"));
app.get("/", async (req, res) => {
  init({ method: "get", url: "" }).then((response) => {
    let ary = [];
    response.data.on("data", (data) => {
      ary.push(data);
    });
    response.data.on("end", () => {
      const result = Buffer.concat(ary);
      const str = iconv.decode(result, "gbk");
      res.send(extractProvincetr(str));
    });
  });
});
app.listen(port, () => {
  console.log(`example 127.0.0.1:${port}`);
});
