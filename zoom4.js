class Zoom4 extends HTMLElement {
  constructor() {
    super();
    this.scale = 1
  }

  connectedCallback() {

    if (this.hasAttribute('option')) {
      let optionValue = this.getAttribute('option')
      switch (optionValue) {
        case 'zoom':
          this.onwheel = (e) => {this.zoom(e)}
          this.resetZoom()
          break;
        case 'drag' :
          this.drag()
          break;
      }
    } else {
      console.error('zoom-element 記得加上 option屬性 例如option="zoom"')
    }

  }

  disconnectedCallback() {
    // called when the element is removed from the DOM
    console.log('removed');
  }

  zoom(e) {
    e.preventDefault();

    this.scale += e.deltaY * -0.01;

    // Restrict scale
    this.scale = Math.min(Math.max(.125, this.scale), 4);
    // Apply scale transform
    this.style.transform = `scale(${this.scale})`;
  }

  resetZoom() {
      const btn = document.querySelector('.test2')
      const zoomElement = document.querySelector('zoom-element')
      btn.addEventListener('click', function () {
        zoomElement.scale = 1;
        zoomElement.style.transform = `scale(1)`;
      })
  }

  drag(){
    const canTouchStart = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
    const canTouchEnd = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
    const canTouchMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';
    const obj = this.querySelector('.content')
    const $left = this.querySelector('.left')
    const $top = this.querySelector('.top')
    let isMove
    obj.addEventListener(canTouchStart, function(event){

      isMove = true

      let abs_x
      if (canTouchStart == 'touchstart') {
        abs_x = event.originalEvent.targetTouches[0].pageX - obj.offsetLeft;
      } else {
        abs_x = event.pageX - obj.offsetLeft;
      }

      let abs_y
      if (canTouchStart == 'touchstart') {
        abs_y = event.originalEvent.targetTouches[0].pageY - obj.offsetTop;
      } else {
        abs_y = event.pageY- obj.offsetTop;
      }
      console.log(isMove,'1');
      obj.addEventListener(canTouchMove,function(event){
        if (isMove) {
          if(canTouchMove == 'touchmove') {
            obj.style.left = event.originalEvent.targetTouches[0].pageX - abs_x
            obj.style.top = event.originalEvent.targetTouches[0].pageY - abs_y
            $left.innerHTML = `${obj.style.left}`
            $top.innerHTML = `${obj.style.top}`
            console.log(isMove,'2');
          } else {
            obj.style.left = event.pageX - abs_x
            obj.style.top = event.pageY - abs_y
            $left.innerHTML = `LEFT ${obj.style.left} `
            $top.innerHTML = `TOP ${obj.style.top}`
            console.log(isMove, '3');
          }
        }
    })
    })
    this.addEventListener(canTouchEnd, function () {
      isMove = false
      console.log(isMove,'4');
    })
    
  }
}

customElements.define('zoom-element', Zoom4);
