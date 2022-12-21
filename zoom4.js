// import OPTIONS from './options';
const options = {}

class zoom4 extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return ['option', 'boundary', 'reset-button'];
  }
  
  attributeChangedCallback(attr, oldVal, newVal) {
    switch (attr) {
      case 'option':
        // move/scale
        //如果有需要提供使用者改變設定，需另外補判斷，如scale => move
        if (newVal === "move" || "scale") {
          this.createDiv(newVal)
          console.log('zoom4 init!!');
        } else {console.error('Must have a value inside zoom-element such as (option="move/scale")')}

        switch (newVal) {
          case 'scale':
            this.zoom()
            break;

          case 'move':
            this.move()
            break;
            
        }
        break;
      
      case 'boundary':

        switch (newVal) {
          case 'inside':
            this.insideBoundary = true
            if (this.getAttribute('boundary') === 'inside' && this.getAttribute('option') === 'scale') {
              console.error('you can only choose either "hide" or "free" value inside the boundary attr.')
            }
            break;

          case 'hide':
            this.style.overflow = 'hidden'
            break;

          default:
            console.log('.move-element has no boundary');
            break;
        }
        break;
      
      case 'reset-button':
        if (newVal === "has-button") {this.resetButton()}
    }
  }
  connectedCallback() {
    this.#create()
  }

  #create() {
    if (!this.hasAttribute('option')) {
      this.setAttribute('option', '');
    }
    if (!this.hasAttribute('boundary')) {
      this.setAttribute('boundary', 'hide');
    }
    if (!this.hasAttribute('reset-button')) {
      this.setAttribute('reset-button', 'has-button');
    }
    this.#mount()
  }

  #mount() {
    console.log('mount');
  }
  disconnectedCallback() {
    // called when the element is removed from the DOM
    console.log('removed');
  }
  //邊界判斷
  insideBoundary = false

  //產出對應的元素
  createDiv(name) {
    const newDiv = document.createElement('div');
    this.appendChild(newDiv);
    newDiv.className = `${name}-element`
  }

  //Reset 按鈕
  resetButton () {
    const btn = document.createElement('div')
    this.appendChild(btn)
    btn.className = 'zoom-reset'
    let e
    if (this.hasAttribute('option')) {
      let optionValue = this.getAttribute('option')
      switch (optionValue) {
        case 'scale':
          e = '.scale-element'
          break;
        case 'move' :
          e = '.move-element'
          break;
      }
    }
    const element = this.querySelector(e)
    btn.addEventListener('click', function () {
      element.style.transform = `scale(1)`;
      element.style.left = '0px'
      element.style.top = '0px'
    })
  }

  zoom() {
    const scaleElement = this.querySelector('.scale-element')
    scaleElement.scale = 1;
    scaleElement.addEventListener('wheel', function(e) {
      e.preventDefault();
      this.scale += e.deltaY * -0.01;
      this.scale = Math.min(Math.max(.125,this.scale), 10);
      this.style.transform = `scale(${this.scale})`;
    })
    
  }

  move(){
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
      
      this.addEventListener(canTouchMove,event => {
        
        if (isMove) {
          if(canTouchMove == 'touchmove') {
            distanceX = event.originalEvent.targetTouches[0].pageX - abs_x
            distanceY = event.originalEvent.targetTouches[0].pageY - abs_y
            if (this.insideBoundary) {
              if ( distanceX > self.offsetWidth - obj.offsetWidth) {
                distanceX = self.offsetWidth - obj.offsetWidth
              } else if( distanceX < 0) {
                distanceX = 0
              }
              if ( distanceY > self.offsetHeight - obj.offsetHeight) {
                distanceY = self.offsetHeight - obj.offsetHeight
              } else if( distanceY < 0) {
                distanceY = 0
              }
            }
          } else {
            distanceX = event.pageX - abs_x
            distanceY = event.pageY - abs_y
            if (this.insideBoundary) {
              if ( distanceX > self.offsetWidth - obj.offsetWidth) {
                distanceX = self.offsetWidth - obj.offsetWidth
              } else if( distanceX < 0) {
                distanceX = 0
              }
              if ( distanceY > self.offsetHeight - obj.offsetHeight) {
                distanceY = self.offsetHeight - obj.offsetHeight
              } else if( distanceY < 0) {
                distanceY = 0
              }
            }
          }
        }
        obj.style.left = `${ distanceX }px`
        obj.style.top = `${ distanceY }px`
        //以下為測試用
        $left.innerHTML = `${ obj.style.left }`
        $top.innerHTML = `${ obj.style.top }`
    })
      
    })

    this.addEventListener(canTouchEnd, function () {
      console.log('mouseup');
      isMove = false
    })
    
  }

}

customElements.define('zoom-element', zoom4);

