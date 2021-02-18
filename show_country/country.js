// [u4e00-u9fa5] 中文
const ajax = new XMLHttpRequest();
ajax.open('get', `provinces`);
ajax.send();
ajax.onreadystatechange = function () {
  if (ajax.readyState === 4 && ajax.status === 200) {
    const result = ajax.responseText;
    console.log(result);
    const provinces = /(<tr\sclass='(provincetr)'>.+)/g;
    const content = /([0-9/]+\.html)/g;
    console.log(result.match(content));
  }
};
