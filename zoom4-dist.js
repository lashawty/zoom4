import OPTIONS from '/options.js';
class zoom4 extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return [];
  }
  
  connectedCallback() {
    this.#create()
    this.move()
  }

  #create() {
    const options = {
      container: this.getAttribute('container') || OPTIONS.SETTINGS.container,
      scale: this.getAttribute('scale') || OPTIONS.SETTINGS.scale,
      minScale: this.getAttribute('min-scale') || OPTIONS.SETTINGS.minScale,
      maxScale: this.getAttribute('max-scale') || OPTIONS.SETTINGS.maxScale,
      button: this.getAttribute('button') || OPTIONS.SETTINGS.button,
      eventListener: this.getAttribute('event-listener') || OPTIONS.SETTINGS.eventListener,
      keyboardCombine: this.getAttribute('keyboard-combine') || OPTIONS.SETTINGS.keyboardCombine,
    }
    this.s = {}
    this.s.options = options
    this.s.newSize = {}
    this.#init()
  }

  //產出對應的元素
  createDiv() {
    const newDiv = document.createElement('div');
    this.appendChild(newDiv);
    newDiv.className = 'move-element'
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

  //啟動
  #init() {
    const el = this.querySelector('.move-element')
    if(!el) alert(`Must have a element class='move-element' inside zoom-element`)
    
    const { scale, button } = this.s.options;
    console.log(this.s.options);
    if(scale === 'zoom') this.zoom()

    if(button === 'has-button') this.clickButtonZoom()
    this.container()
    this.#getCurrentScale()
  }

  //如果子元素寬高 > 父元素，則縮放至可視範圍，並回傳當前scale大小
  #getCurrentScale() {
    //取得元素寬高
    const z4Width = this.offsetWidth
    const z4Height = this.offsetHeight
    const elWidth = this.querySelector('.move-element').offsetWidth
    const elHeight = this.querySelector('.move-element').offsetHeight
    const el = this.querySelector('.move-element')
    let newScale
    //判斷 move-element 寬度是否大於父層
    //如果寬度>或寬度+高度都> 就用寬度的比例
    //如果寬度< 高度> 就用高度
    //如果都小於 就=1

    if (elWidth > z4Width && elHeight > z4Height) {
      newScale = (z4Width / elWidth) * .5
    } else if (elWidth > z4Width) {
      newScale = (z4Width / elWidth) * .9
    } else if (elWidth <= z4Width && elHeight > z4Height) {
      newScale = (z4Height / elHeight) * .9
    } else if (elWidth <= z4Width && elHeight <= z4Height){
      newScale = 1
    }

    el.style.transform = `translate(-50%, -50%) scale(${newScale})`
    return newScale //傳到zoom()
  }

  //判斷最小值
  //如果(父元素寬高/子元素寬高) < 設定值(minScale) 則最小值=(父元素寬高/子元素寬高)
  //如果(父元素/子元素) > 設定值(minScale) 則最小值=minScale
  #getCorrectMinScale() {
    const { minScale, maxScale } = this.s.options;
    const minScaleNumber = Number(minScale)
    let newScale = this.#getCurrentScale()
    let correctMinScale

    if (newScale < minScaleNumber) {
      correctMinScale = newScale
    } else {
      correctMinScale = minScaleNumber
    }
    return correctMinScale
  }

  //取得最小值後，再決定倍率 預設為1 
  // scale(n) 如果 0.1 < n <1 正確倍率則為0.01 以此類推至0.0001
  #setScaleRate() {
    let correctMinScale = this.#getCorrectMinScale()
    //zoom傳入
    let rate = 1
    if(correctMinScale < 1 && correctMinScale > .1){
      rate = .1
    } else if ( correctMinScale <= .1 && correctMinScale > .01) {
      rate = .01
    } else if (correctMinScale < .01 ) {
      rate = .001
    }
    return rate
  }

  //縮放
  zoom() {
    const { minScale, maxScale, eventListener } = this.s.options;
    if (Number(minScale) >= Number(maxScale)) {
      console.error('min-scale 不能大於或等於 max-scale')
      return
    }
    let correctMinScale = this.#getCorrectMinScale()
    let startScale = this.#getCurrentScale()
    let rate = this.#setScaleRate()
    
    const scaleElement = this.querySelector('.move-element')

    scaleElement.scale = startScale
    scaleElement.addEventListener(eventListener.event, function(e) {
      e.preventDefault();
      this.scale += e.deltaY * -0.01 * rate
      this.scale = Math.min(Math.max(correctMinScale,this.scale), maxScale)
      this.style.transform = `translate(-50%, -50%) scale(${this.scale})`
    })
  }

  //按鈕縮放
  clickButtonZoom() {
    console.log(this.zoom());
    const { maxScale } = this.s.options;
    const buttons = document.querySelector('.zoom-buttons')
    const plus = buttons.querySelector('.zoom-plus')
    const minus = buttons.querySelector('.zoom-minus')
    const reset = buttons.querySelector('.zoom-reset')

    let correctMinScale = this.#getCorrectMinScale()
    let startScale = this.#getCurrentScale()
    let rate = this.#setScaleRate()

    const scaleElement = this.querySelector('.move-element')
    scaleElement.scale = startScale



    let oldVal = startScale
    let newVal
    plus.addEventListener('click', function (e) {
      e.preventDefault();
      newVal = oldVal + rate
      oldVal = newVal
      scaleElement.scale = Math.max(correctMinScale,scaleElement.scale)
      scaleElement.style.transform = `translate(-50%, -50%) scale(${oldVal})`

    })
  }
  //位移
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
  
  //設定邊界
  container() {
    const { container } = this.s.options;
    switch (container) {
      case 'inside':
        this.style.overflow = 'hidden'
        break;
    }
  }
}

customElements.define('zoom-element', zoom4);
//# sourceMappingURL=zoom4-dist.js.map