// import Panzoom from '@panzoom/panzoom'

// const elem = document.getElementById('panzoom-element')
// const panzoom = Panzoom(elem, {
//   maxScale: 5
// })
// panzoom.pan(10, 10)
// panzoom.zoom(2, { animate: true })

// // Panning and pinch zooming are bound automatically (unless disablePan is true).
// // There are several available methods for zooming
// // that can be bound on button clicks or mousewheel.
// button.addEventListener('click', panzoom.zoomIn)
// elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)



function zoom(event) {
  event.preventDefault();

  scale += event.deltaY * -0.01;

  // Restrict scale
  scale = Math.min(Math.max(.125, scale), 4);

  // Apply scale transform
  el.style.transform = `scale(${scale})`;
}

let scale = 1;
const el = document.querySelector('.test2');
el.onwheel = zoom;
