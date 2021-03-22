const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;
/**
 * 添加svg容器
 */
function addSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'svg';
  svg.setAttribute('width', SVG_WIDTH);
  svg.setAttribute('height', SVG_HEIGHT);
  return svg;
}
/**
 * svg容器描边
 */
function svgStroke() {
  const svg = d3.select('#svg');
  const path = `M0,0 L${SVG_WIDTH}, 0 V${SVG_WIDTH},${SVG_HEIGHT} L0,${SVG_HEIGHT} Z`;
  svg.append('g').append('path').attr('d', path).attr('stroke', '#f24').attr('stroke-width', 2).attr('fill', 'none');
}

/**
 * 填充svg
 */
function fill() {
  const xScale = d3.scaleLinear().domain([0, SVG_WIDTH]).range([0, SVG_WIDTH]);
  const yScale = d3.scaleLinear().domain([0, SVG_HEIGHT]).range([SVG_HEIGHT, 0]);
  const svg = d3.select('#svg');
  const circle = [
    {
      x: 20,
      y: 50,
    },
    {
      x: 300,
      y: SVG_HEIGHT / 2,
    },
    {
      x: 400,
      y: SVG_HEIGHT / 3,
    },
  ];
  const d = circle.map((item) => `L${xScale(item.x)} ${yScale(item.y)}`);
  svg
    .append('g')
    .append('path')
    .attr('d', `M${xScale(20)},${yScale(50)} ${d}`)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
}

function main() {
  fill();
  svgStroke();
}

const root = document.getElementById('root');
root.appendChild(addSvg());
main();
