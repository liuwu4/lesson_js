function ract(event) {
  return event.getBoundingClientRect(event);
}

function load() {
  // 外层容器
  const container = document.getElementById('container');
  const containerRact = ract(container);
  // 内容容器
  const content = document.getElementById('content');
  const contentRact = ract(content);
  let scroll = document.getElementById('scroll');
  let scrollBlok = document.getElementById('scroll-blok');
  let scrollRact = ract(scroll);
  // 高度差
  const heightDiff = contentRact.height - containerRact.height;
  let top = 0;
  content.onmousemove = function () {
    if (heightDiff > 0) {
      scrollBlok.style.height = heightDiff + 'px';
    }
  };
  content.onmouseout = function () {
    scroll.style.display = 'none';
  };
  let wheelTimer = null;
  content.onwheel = function (event) {
    const { deltaY } = event;
    scroll.style.display = 'block';
    scroll = document.getElementById('scroll');
    scrollBlok = document.getElementById('scroll-blok');
    scrollRact = ract(scroll);
    if (wheelTimer) {
      clearInterval(wheelTimer);
    }
    wheelTimer = setTimeout(() => {
      scroll.style.display = 'none';
    }, 500);
    top += deltaY;
    if (top < 0) {
      top = 0;
    }
    if (top > scrollRact.height - heightDiff) {
      top = scrollRact.height - heightDiff;
    }
    scrollBlok.style.top = top + 'px';
    content.style.top = -top + 'px';
  };
}
load();
