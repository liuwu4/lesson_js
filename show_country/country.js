// [\u4e00-\u9fa5] 中文
const ajax = new XMLHttpRequest();
function start(path) {
  ajax.open('get', path);
  ajax.send();
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const result = JSON.parse(ajax.responseText);
      findRoot(result);
    }
  };
}

function findRoot(data) {
  let node = document.getElementById('root');
  const [keys] = Object.keys(data);
  data[keys].forEach((item) => {
    const area = `${keys} ${keys}-${keys === 'provincetr' ? item.code : item.parent_code}`;
    const className = `${area} ${keys !== 'villagetr' ? 'cursor' : ''}`;
    const childNode = document.createElement('div');
    childNode.setAttribute('class', className);
    childNode.setAttribute('title', item.code);
    childNode.onclick = function () {
      keys !== 'villagetable' ? start(item.code) : alert('已经是最后一级');
    };
    childNode.innerText = `${item.code}-${item.name}`;
    node.appendChild(childNode);
  });
}

start('0');

function rules(result) {
  const provinces = /(<tr\sclass='(provincetr|citytr|countytr|towntr|villagetr|villagetable)'>.+)/g;
  const content = /([0-9]+(?=\/)|[0-9]+(?=\.html)|[\u4e00-\u9fa5]+)/g;
  const tdText = /[0-9/]+(\.html)?['>]+(?:[\u4e00-\u9fa5]+)/g;
  const lastLevel = /(<tr\s[a-z='>]+[<a-z0-9\u4e00-\u9fa5>/]+)/g;
  const trItem = result.match(provinces);
  let tdItem = [];
  trItem.forEach((item) => {
    if (/villagetr/.test(item)) {
      tdItem = item.match(lastLevel).map((item) => {
        const pattern = /([0-9\u4e00-\u9fa5]+)/g;
        const result = item.match(pattern);
        return { code: result[0], name: result[2], category: result[1] };
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
          parent_code: code.join(''),
          name: last,
        });
        return [...pre, tmp];
      }, []);
    }
  });
}
