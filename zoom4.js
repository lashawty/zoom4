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
          this.zoom()
          if(this.getAttribute('reset-button') == "has-button" ) {
            this.resetZoom()
          }
          break;
        case 'move' :
          this.move()
          if(this.getAttribute('reset-button') == "has-button" ) {
            this.resetMove()
          }
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

  zoom() {
    const scaleElement = document.createElement('div')
    this.appendChild(scaleElement)
    scaleElement.className = 'scale-element'
    scaleElement.scale = 1;
    scaleElement.addEventListener('wheel', function(e) {
      e.preventDefault();
      this.scale += e.deltaY * -0.01;
      // Restrict scale
      this.scale = Math.min(Math.max(.125,this.scale), 10);
      // Apply scale transform
      this.style.transform = `scale(${this.scale})`;
    })
    
  }

  resetZoom() {
    const btn = document.createElement('div')
    this.appendChild(btn)
    btn.className = 'zoom-reset'
    const scaleElement = this.querySelector('.scale-element')
    btn.addEventListener('click', function () {
      scaleElement.scale = 1;
      scaleElement.style.transform = `scale(1)`;
    })
  }

  move(){
    //產出一個move-element
    const newDiv = document.createElement('div');
    this.appendChild(newDiv);
    newDiv.className = 'move-element'
    
    //宣告
    const canTouchStart = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
    const canTouchEnd = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
    const canTouchMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';
    const obj = this.querySelector('.move-element')
    const self = this
    let isMove
    let abs_x
    let abs_y
    let distanceX
    let distanceY
    let isBoundary = false
    //boundary判斷
    if (this.hasAttribute('boundary') && this.getAttribute('boundary') == 'inside') {
      isBoundary = true
    }
    if (this.getAttribute('boundary') == 'hide') {
      this.style.overflow = 'hidden'
    }
    //以下宣告為測試用
    const $left = this.querySelector('.left')
    const $top = this.querySelector('.top')
    $left.innerHTML = `Left ${obj.offsetLeft} px`
    $top.innerHTML = `Top ${obj.offsetTop} px`
    
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
            distanceX = event.originalEvent.targetTouches[0].pageX - abs_x
            distanceY = event.originalEvent.targetTouches[0].pageY - abs_y
          } else {
            distanceX = event.pageX - abs_x
            distanceY = event.pageY - abs_y
          }
        }

        //限制在容器內移動
        if(isBoundary) {
          if (distanceX > self.offsetWidth - obj.offsetWidth) {
            distanceX = self.offsetWidth - obj.offsetWidth
          } else if( distanceX < 0) {
            distanceX = 0
          }
          if (distanceY > self.offsetHeight - obj.offsetHeight) {
            distanceY = self.offsetHeight - obj.offsetHeight
          } else if( distanceY < 0) {
            distanceY = 0
          }
        }

        obj.style.left = `${ distanceX }px`
        obj.style.top = `${ distanceY }px`
        //以下為測試用
        $left.innerHTML = `${ obj.style.left }`
        $top.innerHTML = `${ obj.style.top }`
    })
      
    })

    //isMove = false
    this.addEventListener('mouseleave', function () {
      console.log('mouseleave');
      isMove = false
    })
    this.addEventListener(canTouchEnd, function () {
      console.log('mouseup');
      isMove = false
    })
  
  }


  resetMove() {
    const btn = document.createElement('div')
    this.appendChild(btn)
    btn.className = 'zoom-reset'
    const moveElement = this.querySelector('.move-element')
    const originalLeft = moveElement.offsetLeft
    const originalTop = moveElement.offsetTop
    btn.addEventListener('click', function () {
      moveElement.style.left = `${ originalLeft }px`
      moveElement.style.top = `${ originalTop }px`
    })
  }
}

customElements.define('zoom-element', Zoom4);