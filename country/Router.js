const express = require('express');
const app = express();
const iconv = require('iconv-lite');
const axios = require('axios');
const { transform } = require('../common/transform');
const port = 3000;
const { mysql } = require('../db/mysql');
const db = {
  provincetr: 'province',
  citytr: 'city',
  countytr: 'area',
  towntr: 'town',
  villagetr: 'village',
  villagetable: 'village_table',
};
const parent = {
  provincetr: 'province',
  citytr: 'province',
  countytr: 'city',
  towntr: 'area',
  villagetr: 'town',
  villagetable: 'village',
};
const base = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/`;
const init = axios.create({
  baseURL: base,
  headers: {
    Accept: 'text/html',
  },
  responseType: 'stream',
});
app.use(express.static(process.cwd()));
app.get('(/:code)+', (req, res) => {
  const {
    params: { code },
  } = req;
  init({ method: 'get', url: +code !== 0 ? `${req.url}.html` : '' }).then((response) => {
    send(code, res, response);
  });
});

function send(parentCode, res, axiosResponse) {
  let ary = [];
  axiosResponse.data.on('data', (data) => {
    ary.push(data);
  });
  axiosResponse.data.on('end', () => {
    const result = Buffer.concat(ary);
    const str = iconv.decode(result, 'gbk');
    const transformData = transform(parentCode, str);
    insertDb(transformData);
    res.send(transformData);
  });
}
function insertDb(data) {
  const [keys] = Object.keys(data);
  const tableName = db[keys];
  const parentId = `${parent[keys]}_id`;
  let insert = `
    insert into ${tableName}(id, ${tableName}_name, ${parentId})
    values ?
    on duplicate key update
    ${parentId}=values(${parentId}),
    ${tableName}_name = values(${tableName}_name)
  `;
  let values = data[keys].map((item) => [item.code.match(/[0-9]+/g).pop(), item.name, item.parent_code]);
  if (tableName === 'village_table') {
    insert = `
      insert into ${tableName}(id, ${tableName}_name, ${parentId}, code)
      values ?
      on duplicate key update
      code = values(code),
      ${parentId}=values(${parentId}),
      ${tableName}_name = values(${tableName}_name)
    `;
    values = data[keys].map((item) => [item.code.match(/[0-9]+/g).pop(), item.name, item.parent_code, item.category]);
  }
  mysql.query(insert, [values], queryCallback);
}
function queryCallback(error, rows, fields) {
  if (error) {
    console.log('error', error);
  }
}
app.listen(port, () => {
  console.log(`example 127.0.0.1:${port}`);
});
