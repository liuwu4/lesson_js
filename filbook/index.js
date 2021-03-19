let animate = null;
let time = new Date().getTime();
function start(event, page) {
  const allPage = document.querySelectorAll('.book');
  let currentLeft = event.offsetLeft;
  let nextId = page + 1;
  // 向右翻页
  if (currentLeft === 0) {
    nextId = page - 1;
    if (page > 1) {
      filpbook(event, page);
    }
    if (nextId > 1) {
      const node = document.getElementById('page' + nextId);
      filpbook(node, nextId);
    }
    return;
  }
  // 向左翻页
  if (page < allPage.length) {
    filpbook(event, page);
  }
  if (nextId < allPage.length) {
    const node = document.getElementById('page' + nextId);
    filpbook(node, nextId);
  }
}
/**
 * 执行翻页动画
 * @param {*} event 翻页节点
 * @param {*} page 当前页码
 * @returns
 */
function filpbook(event, page) {
  const currentWidth = event.offsetWidth;
  const allPage = document.querySelectorAll('.book');
  let currentLeft = event.offsetLeft;
  let dange = 90;
  // 向右翻页
  if (currentLeft === 0) {
    animate = window.requestAnimationFrame(function rotate() {
      if (dange === 90) {
        event.style.transform = `rotateY(90deg)`;
        event.style.left = currentWidth + 'px';
        event.style.transformOrigin = 'left';
      }
      dange -= 10;
      event.style.transform = `rotateY(${dange}deg)`;
      event.style.zIndex = 10;
      if (dange === 0) {
        event.style.zIndex = allPage.length - page;
        event.style.transform = `rotateY(0deg)`;
        window.cancelAnimationFrame(rotate);
        return;
      }
      animate = window.requestAnimationFrame(rotate);
    });
    return;
  }
  // 向左翻页
  animate = window.requestAnimationFrame(function rotate() {
    if (dange === 90) {
      event.style.transform = `rotateY(0deg)`;
      event.style.left = 0;
      event.style.transformOrigin = 'right';
    }
    dange -= 10;
    event.style.zIndex = 10;
    event.style.transform = `rotateY(${dange}deg)`;
    if (dange === 0) {
      event.style.zIndex = page;
      window.cancelAnimationFrame(rotate);
      return;
    }
    animate = window.requestAnimationFrame(rotate);
  });
}
function startAnimated(event) {
  var animate = document.getElementById('animate');
  animate.setAttribute('class', 'start-animated');
}

function resetAnimated(event) {
  var animate = document.getElementById('animate');
  animate.removeAttribute('class');
}
