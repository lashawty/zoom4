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
        case 'move' :
          this.move()
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

  move(){
    const newDiv = document.createElement('div');
    this.appendChild(newDiv);
    newDiv.className = 'move-element'
    
    const canTouchStart = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
    const canTouchEnd = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
    const canTouchMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';
    const obj = this.querySelector('.move-element')
    const $left = this.querySelector('.left')
    const $top = this.querySelector('.top')
    $left.innerHTML = `Left ${obj.offsetLeft} px`
    $top.innerHTML = `Top ${obj.offsetTop} px`
    const self = this
    let isMove
    let abs_x
    let abs_y
    this.addEventListener(canTouchStart, function(event){
      event.preventDefault()
      isMove = true
      //抓取子元素原本的位置
      if (canTouchStart == 'touchstart') {
        abs_x = event.originalEvent.targetTouches[0].pageX - obj.offsetLeft;
        abs_y = event.originalEvent.targetTouches[0].pageY - obj.offsetTop;
      } else {
        abs_x = event.pageX - obj.offsetLeft
        abs_y = event.pageY - obj.offsetTop
      }
      
      obj.addEventListener(canTouchMove,function(event){
        if (isMove) {
          if(canTouchMove == 'touchmove') {
            let distanceX = event.originalEvent.targetTouches[0].pageX - abs_x
            let distanceY = event.originalEvent.targetTouches[0].pageY - abs_y

            obj.style.left = `${ distanceX }px`
            obj.style.top = `${ distanceY }px`
            
          } else {
            let distanceX = event.pageX - abs_x
            let distanceY = event.pageY - abs_y

            //以下為判斷是否超出父層
            // if (distanceX > self.offsetWidth - obj.offsetWidth) {
            //   distanceX = self.offsetWidth - obj.offsetWidth
            // } else if(distanceX < 0) {
            //   distanceX = 0
            // }
            // if (distanceY > self.offsetHeight - obj.offsetHeight) {
            //   distanceX = self.offsetHeight - obj.offsetHeight
            // } else if(distanceY < 0) {
            //   distanceY = 0
            // }
            
            obj.style.left = `${ distanceX }px`
            obj.style.top = `${ distanceY }px`
          }
        }
        $left.innerHTML = `${obj.style.left}`
        $top.innerHTML = `${obj.style.top}`
    })
      
    })
    this.addEventListener('mouseleave', function () {
      console.log('mouseleave');
      isMove = false
    })
    this.addEventListener(canTouchEnd, function () {
      console.log('mouseup');
      isMove = false
    })
  
  }

}

customElements.define('zoom-element', Zoom4);