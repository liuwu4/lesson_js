function transform(parentCode, result) {
  const provinces = /(<tr\sclass='(provincetr|citytr|countytr|towntr|villagetr|villagetable)'>.+)/g;
  const content = /([0-9]+(?=\/)|[0-9]+(?=\.html)|[\u4e00-\u9fa5]+)/g;
  const tdText = /[0-9/]+(\.html)?['>]+(?:[\u4e00-\u9fa5]+)/g;
  const lastLevel = /(<tr\s[a-z='>]+[<a-z0-9\u4e00-\u9fa5>/]+)/g;
  const keyPattern = /provincetr|citytr|countytr|towntr|villagetr|villagetable/;
  const trItem = result.match(provinces);
  let tdItem = [];
  trItem.forEach((item) => {
    if (/villagetr/.test(item)) {
      tdItem = item.match(lastLevel).map((item) => {
        const pattern = /([0-9\u4e00-\u9fa5]+)/g;
        const result = item.match(pattern);
        return {
          code: result[0],
          name: result[2],
          parent_code: parentCode,
          category: result[1],
        };
      });
    } else {
      tdItem = item.match(tdText).reduce((pre, next) => {
        const tmp = {};
        const nextItem = next.match(content);
        const routes = next.match(/[0-9]+(?:\.html)/g);
        const code = `${routes}`.match(/([0-9]{2}([0-9](?=\.html))?)/g);
        const last = nextItem.pop();
        let url = code;
        if (code.length !== 1) {
          code.pop();
          url = code.join('/') + '/' + nextItem[nextItem.length - 1];
        }
        Object.assign(tmp, {
          code: `${url}`,
          parent_code: parentCode,
          name: last,
        });
        return [...pre, tmp];
      }, []);
    }
  });
  const key = result.match(keyPattern);
  return { [key[0]]: tdItem };
}

module.exports = {
  transform,
};
