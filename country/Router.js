const express = require('express');
const app = express();
const iconv = require('iconv-lite');
const port = 3000;
const axios = require('axios');
const base = `http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/`;
const init = axios.create({
  baseURL: base,
  headers: {
    Accept: 'text/html'
  },
  responseType: 'stream'
});
app.use(express.static(process.cwd()));
app.get('/provinces', async (req, res) => {
  init({ method: 'get', url: '' }).then((response) => {
    let ary = [];
    response.data.on('data', (data) => {
      ary.push(data);
    });
    response.data.on('end', () => {
      const result = Buffer.concat(ary);
      const str = iconv.decode(result, 'gbk');
      res.send(str);
    });
  });
});
app.get('/:code', async (req, res) => {
  console.log(req.params);
  const {
    params: { code }
  } = req;
  init({ method: 'get', url: `${code}.html` }).then((response) => {
    let ary = [];
    response.data.on('data', (data) => {
      ary.push(data);
    });
    response.data.on('end', () => {
      const result = Buffer.concat(ary);
      const str = iconv.decode(result, 'gbk');
      res.send(str);
    });
  });
});
app.listen(port, () => {
  console.log(`example 127.0.0.1:${port}`);
});
