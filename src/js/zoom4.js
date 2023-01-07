import OPTIONS from './options.js';

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
      event: this.getAttribute('event') || OPTIONS.SETTINGS.event,
      combineKey: this.getAttribute('key-combine') || OPTIONS.SETTINGS.combineKey,
      element: this.getAttribute('move-element') || OPTIONS.SETTINGS.element,
    }
    this.s = {}
    this.s.options = options
    this.s.newSize = {}
    this.#init()
  }

  //啟動
  #init() {
    const el = this.querySelector('.move-element')
    if(!el) alert(`Must have a element class='move-element' inside zoom-element`)
    
    const { scale, button, event } = this.s.options;
    
    this.#mount()
    
    if(button === 'has-button') this.clickButtonZoom()
    if(scale === 'on') {
      this.wheelZoom()
      this.doubleFingerZoom()
    }
    if(event !== 'none') {
      this.eventZoom()
      
    }
  }

  //裝置判斷
  #isMobileDevice() {
    const mobileDevice = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'Windows Phone']
    let isMobileDevice = mobileDevice.some(e => navigator.userAgent.match(e))
    this.s.options.isMobileDevice = isMobileDevice
  } 
  
  #mount(){
    this.#isMobileDevice()
    this.container()
    this.#getCurrentScale()
    this.#getCorrectLimitScale()
    this.#setScaleRate()
    this.demo()
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
    
    this.s.options.currentScale = newScale
    this.s.options.originalScale = newScale
    el.style.transform = `translate(-50%, -50%) scale(${newScale})`
  }

  //判斷最小值
  //如果(父元素寬高/子元素寬高) < 設定值(minScale) 則最小值=(父元素寬高/子元素寬高)
  //如果(父元素/子元素) > 設定值(minScale) 則最小值=minScale
  #getCorrectLimitScale() {
    const { minScale, maxScale, currentScale } = this.s.options;
    let correctMinScale
    let correctMaxScale

    if (currentScale === 1) {
      correctMinScale = minScale
      correctMaxScale = maxScale
    } else {
      correctMinScale = currentScale * minScale
      correctMaxScale = currentScale * maxScale
    }
    this.s.options.correctMinScale = Number(correctMinScale)
    this.s.options.correctMaxScale = Number(correctMaxScale)
  }

  //取得最小值後，再決定倍率 預設為1 
  // scale(n) 如果 0.1 < n <1 正確倍率則為0.01 以此類推至0.0001
  #setScaleRate() {
    let correctMinScale = this.s.options.correctMinScale
    //zoom傳入
    let rate = 1
    if(correctMinScale < 1 && correctMinScale >= .1){
      rate = .1
    } else if ( correctMinScale < .1 && correctMinScale >= .01) {
      rate = .01
    } else if (correctMinScale < .01 ) {
      rate = .001
    }
    this.s.options.rate = rate
  }

  //滾輪縮放
  wheelZoom() {
    if (this.s.options.isMobileDevice) return
    const { minScale, maxScale, correctMaxScale, correctMinScale, combineKey } = this.s.options;
    if (Number(minScale) >= Number(maxScale)) {
      console.error('min-scale 不能大於或等於 max-scale')
      return
    }
    let rate = this.s.options.rate
    const self = this
    const scaleElement = this.querySelector('.move-element')
    const mask = this.querySelector('.mask')


    switch (combineKey) {
      case 'off':
        mask.style.display = 'none'
        scaleElement.addEventListener('wheel', function(e) {
          e.preventDefault();
          this.scale = Number(self.s.options.currentScale)
          this.scale += e.deltaY * -0.01 * rate
          this.scale = Math.min(Math.max(correctMinScale,this.scale), correctMaxScale)
          self.s.options.currentScale = this.scale
          this.style.transform = `translate(-50%, -50%) scale(${this.scale})`
        })
        break;
    
      case 'on':
        let keyDown = false
        setTimeout(() => {
          mask.style.display = 'none'
        }, 300);
        document.addEventListener('keydown', (event)=> {
          if(event.key === 'Shift'){
            keyDown = true
          } 
        })
        document.addEventListener('keyup', (event)=> {
            keyDown = false
        })
        scaleElement.addEventListener('wheel', function(e) {
          if (keyDown) {
          e.preventDefault();
          this.scale = Number(self.s.options.currentScale)
          this.scale += e.deltaY * -0.01 * rate
          this.scale = Math.min(Math.max(correctMinScale,this.scale), correctMaxScale)
          self.s.options.currentScale = this.scale
          this.style.transform = `translate(-50%, -50%) scale(${this.scale})`
          this.style.transform = `translate(-50%, -50%) scale(${this.scale})`
          }
        })
        break;
    }
  }

  //雙指縮放
  doubleFingerZoom() {
    if (!this.s.options.isMobileDevice) return
    //宣告
    const { event, correctMaxScale, originalScale } = this.s.options
    const element = this.querySelector('.move-element')
    const z4 = this
    let hammertime = new Hammer(element);
    switch (event) {
      case 'doublefinger':
        hammertime.get('pinch').set({ enable: true });
        hammertime.on('pinchout', function(ev) {
          element.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
        });
        hammertime.on('pinchin', function(ev) {
          element.style.transform = `translate(-50%, -50%) scale(${originalScale})`
          z4.s.options.currentScale = z4.s.options.originalScale
        });
        break;
      case 'click':
        hammertime.on('tap', function(ev) {
          if (z4.s.options.currentScale < z4.s.options.correctMaxScale) {
            element.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
            z4.s.options.currentScale = z4.s.options.correctMaxScale
          } else {
            element.style.transform = `translate(-50%, -50%) scale(${originalScale})`
            z4.s.options.currentScale = z4.s.options.originalScale
          }
        });
      break;
      case 'dblclick':
        var mc = new Hammer.Manager(element);
        mc.add( new Hammer.Tap({ taps: 2 }) );
        mc.on('tap', function(ev) {
          if (z4.s.options.currentScale < z4.s.options.correctMaxScale) {
            element.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
            z4.s.options.currentScale = z4.s.options.correctMaxScale
          } else {
            element.style.transform = `translate(-50%, -50%) scale(${originalScale})`
            z4.s.options.currentScale = z4.s.options.originalScale
          }
        });
      break;
      case 'hover':
        hammertime.on('press', function(ev) {
          element.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
        });
        hammertime.on('pressup', function(ev) {
          element.style.transform = `translate(-50%, -50%) scale(${originalScale})`
          z4.s.options.currentScale = z4.s.options.originalScale
        });
      break;
    }

  
    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', function(ev) {
      element.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
      z4.s.options.currentScale = z4.s.options.correctMaxScale
    });
    hammertime.on('pinchin', function(ev) {
      element.style.transform = `translate(-50%, -50%) scale(${originalScale})`
      z4.s.options.currentScale = z4.s.options.originalScale
    });
  }

  //按鈕縮放
  clickButtonZoom() {
    const { correctMaxScale, originalScale
    } = this.s.options;
    const buttons = document.querySelector('.zoom-buttons')
    const plus = buttons.querySelector('.zoom-plus')
    const minus = buttons.querySelector('.zoom-minus')
    const reset = buttons.querySelector('.zoom-reset')
    const self = this
    let rate = Number(this.s.options.rate)
    const scaleElement = this.querySelector('.move-element')
    let newVal

    plus.addEventListener('click', function (e) {
      e.preventDefault();
      let startScale = Number(self.s.options.currentScale)
      newVal = startScale * (1 + rate)
      self.s.options.currentScale = newVal
      startScale = newVal
      if (startScale >= correctMaxScale) {
        startScale = correctMaxScale
      }
      console.log(self.s.options,'plus');
      self.s.options.currentScale = Number(startScale)
      scaleElement.style.transform = `translate(-50%, -50%) scale(${startScale})`
    })


    minus.addEventListener('click', function (e) {
      e.preventDefault();
      let startScale = Number(self.s.options.currentScale)
      newVal = startScale / (1 + rate)
      self.s.options.currentScale = newVal
      startScale = newVal
      if (startScale <= self.s.options.correctMinScale) {
        startScale = self.s.options.correctMinScale
      }
      self.s.options.currentScale = Number(startScale)
      console.log(self.s.options,'minus');
      scaleElement.style.transform = `translate(-50%, -50%) scale(${startScale})`
    })
    
    reset.addEventListener('click', function (e) {
      e.preventDefault();
      self.s.options.currentScale = originalScale
      scaleElement.style.transform = `translate(-50%, -50%) scale(${originalScale})`
    })
  }

  //事件縮放
  eventZoom() {
    if (this.s.options.isMobileDevice) return
    const { event, correctMaxScale, originalScale } = this.s.options
    const element = this.querySelector('.move-element')
    const z4 = this
    if (event === 'hover') {
      element.addEventListener('mouseenter', function () {
        if (z4.s.options.currentScale !== correctMaxScale) {
          this.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
          console.log(z4.s.options);
        }
      })
      element.addEventListener('mouseleave', function () {
        this.style.transform = `translate(-50%, -50%) scale(${originalScale})`
        z4.s.options.currentScale = z4.s.options.originalScale
        console.log(z4.s.options);
      })
    } else {
      element.addEventListener(event, function () {
        if (z4.s.options.currentScale < correctMaxScale) {
          this.style.transform = `translate(-50%, -50%) scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
          console.log(z4.s.options);
        } else {
          this.style.transform = `translate(-50%, -50%) scale(${originalScale})`
          z4.s.options.currentScale = z4.s.options.originalScale
          console.log(z4.s.options);
        }
      })
    }
    
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
    
    this.addEventListener(canTouchStart, function(event){
      
      event.preventDefault()
      isMove = true
      //抓取子元素原本的位置
      if (canTouchStart == 'touchstart') {
        abs_x = event.targetTouches[0].pageX - obj.offsetLeft;
        abs_y = event.targetTouches[0].pageY - obj.offsetTop;
      } else {
        abs_x = event.pageX - obj.offsetLeft
        abs_y = event.pageY - obj.offsetTop
      }
      
      this.addEventListener(canTouchMove,event => {
        
        if (isMove) {
          if(canTouchMove == 'touchmove') {
            distanceX = event.targetTouches[0].pageX - abs_x
            distanceY = event.targetTouches[0].pageY - abs_y
          } else {
            distanceX = event.pageX - abs_x
            distanceY = event.pageY - abs_y
          }
        }
        obj.style.left = `${ distanceX }px`
        obj.style.top = `${ distanceY }px`
        
        //以下為測試用
        this.s.options.distanceX = distanceX
        this.s.options.distanceY = distanceY
    })
      
    })

    this.addEventListener(canTouchEnd, function () {
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

  //demo
  demo() {
    console.log(this.s.options);
    const {maxScale, minScale, scale, container, event, button, combineKey} = this.s.options
    //按鈕區塊
    const buttons = document.querySelector('.zoom-buttons')
    if(button !== 'has-button') buttons.classList.add('off')
    //最大值、最小值設定
    const maxInput = document.querySelector('.max-value')
    const minInput = document.querySelector('.min-value')
    maxInput.value = maxScale
    minInput.value = minScale
    //事件
    // const eventBox = document.querySelector('.event')
    switch (event) {
      case 'click':
        document.querySelector('.click').classList.add('active')
        break;
      case 'hover':
        document.querySelector('.hover').classList.add('active')
        break;
      case 'dblclick':
        document.querySelector('.doubleclick').classList.add('active')
        break;
      case 'none':
        document.querySelector('.none').classList.add('active')
        break;
    }
    //範圍
    const containerGroup = document.querySelector('.container')
    if(container === 'inside') {
      containerGroup.classList.add('on')
    } else {
      containerGroup.classList.add('off')
    }
    //滾輪控制
    const wheel = document.querySelector('.wheel')
    if(scale ==='on') {
      wheel.classList.add('on')
    } else {
      wheel.classList.add('off')
    }

    //組合鍵
    const keyCombine = document.querySelector('.key-combine')
    if (scale === 'off') return
    if (combineKey === 'on') {
      keyCombine.classList.add('on')
    } else {
      keyCombine.classList.add('off')
    }
  }
}

customElements.define('zoom-element', zoom4);
