function extractProvincetr(data) {
  console.log(data);
  const province = /(<tr\s.+\/tr>)/g;
  const result = data.match(province);
  return result;
}
module.exports = {
  extractProvincetr,
};
