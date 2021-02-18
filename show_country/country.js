// [\u4e00-\u9fa5] 中文
const ajax = new XMLHttpRequest();

function start(path) {
  ajax.open('get', path);
  ajax.send();
  ajax.onreadystatechange = function () {
    if (ajax.readyState === 4 && ajax.status === 200) {
      const result = ajax.responseText;
      const provinces = /(<tr\sclass='(provincetr|citytr)'>.+)/g;
      const content = /([0-9/]+\.html|[\u4e00-\u9fa5]+)/g;
      const tdText = /[0-9/]+\.html['>]+(?:[\u4e00-\u9fa5]+)/g;
      const trItem = result.match(provinces);
      let tdItem = [];
      trItem.forEach((item) => {
        tdItem = item.match(tdText).reduce((pre, next) => {
          const tmp = {};
          console.log(next);
          const nextItem = next.match(content);
          Object.assign(tmp, {
            code: `${nextItem[0].match(/([0-9]+)/g)}`,
            name: nextItem[1]
          });
          return [...pre, tmp];
        }, []);
      });
      findRoot(tdItem);
    }
  };
}
function findRoot(data) {
  const node = document.getElementById('root');
  data.forEach((item) => {
    const childNode = document.createElement('div');
    childNode.setAttribute('class', 'ele');
    childNode.onclick = function () {
      start(item.code);
    };
    childNode.innerText = item.name;
    node.appendChild(childNode);
  });
}
start('provinces');
