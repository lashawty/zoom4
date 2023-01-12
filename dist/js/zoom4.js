/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  SETTINGS: {
    container: 'inside', // 是否可以超出邊界
    scale: 'off', // 是否可以縮放 on || off
    minScale: '0.1',
    maxScale: '4',
    button: 'has-button', // 是否綁定按鈕控制放大縮小 has-button || none
    rate: 1,
    event: 'none', // click || dblclick || hover || none 
    combineKey: 'off',
    element: '.move-element'
  },
});


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


class zoom4 extends HTMLElement {
  constructor() {
    super();
  }
  static get observedAttributes() {
    return [];
  }
  
  connectedCallback() {
    this.#create()
  }

  #create() {
    const options = {
      container: this.getAttribute('container') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.container,
      scale: this.getAttribute('scale') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.scale,
      minScale: this.getAttribute('min-scale') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.minScale,
      maxScale: this.getAttribute('max-scale') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.maxScale,
      button: this.getAttribute('button') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.button,
      event: this.getAttribute('event') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.event,
      combineKey: this.getAttribute('key-combine') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.combineKey,
      element: this.getAttribute('move-element') || _options_js__WEBPACK_IMPORTED_MODULE_0__["default"].SETTINGS.element,
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
      this.eventZoomRWD()
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
    this.#getCurrentScale()
    this.#getCorrectMinScale()
    this.#setPosition()
    this.#getInsideCorrectMaxScale()
    this.#setScaleRate()
    this.#freeContainer() 
    this.move()
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
    el.style.transform = `scale(${newScale})`
  }

  //判斷最小值
  //如果(父元素寬高/子元素寬高) < 設定值(minScale) 則最小值=(父元素寬高/子元素寬高)
  //如果(父元素/子元素) > 設定值(minScale) 則最小值=minScale
  #getCorrectMinScale() {
    const { minScale, maxScale, currentScale } = this.s.options;
    let correctMinScale, correctMaxScale
    const el = this.querySelector('.move-element')
    console.log(this.s.options);
    if (currentScale === 1) {
      correctMinScale = minScale
      correctMaxScale = maxScale
    } else {
      correctMinScale = currentScale * minScale
      correctMaxScale = currentScale * maxScale
    }

    this.s.options.correctMinScale = Number(correctMinScale)
    this.s.options.correctMaxScale = Number(correctMaxScale)

    if (this.s.options.correctMinScale >= this.s.options.currentScale) {
      el.style.transform = `scale(${this.s.options.correctMinScale})`
      this.s.options.currentScale = this.s.options.correctMinScale
      this.s.options.originalScale = this.s.options.correctMinScale

    }
  }
  //如果container是inside 最大倍率=父元素寬高/子元素寬高
  #getInsideCorrectMaxScale() {
    const { correctMaxScale, container, element, elWidthBefore, elHeightBefore, z4Width, z4Height } = this.s.options;

    //如果設定不是inside就返回
    if (container !== 'inside') return

    //如果範圍設置為inside, 正確最大縮放倍率為父層寬高 / 當前縮放倍率
    const z4 = this
    const el = this.querySelector(element)

    //取得元素最大寬高
    let currentMaxWidth = elWidthBefore * correctMaxScale
    let currentMaxHeight = elHeightBefore * correctMaxScale
    let insideCorrectMaxScale
    if (currentMaxWidth >=  z4Width || currentMaxHeight >= z4Height) {
      insideCorrectMaxScale = Math.min((z4Width / elWidthBefore),(z4Height / elHeightBefore))
      z4.s.options.correctMaxScale = insideCorrectMaxScale
    }
    if (this.s.options.correctMinScale >= this.s.options.correctMaxScale) {
      console.error('最小倍率應小於最大倍率')
    }
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
          this.style.transform = `scale(${this.scale})`
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
          this.style.transform = `scale(${this.scale})`
          this.style.transform = `scale(${this.scale})`
          }
        })
        break;
    }
  }

  //手機版雙指縮放
  doubleFingerZoom(){
    if (!this.s.options.isMobileDevice) return
    const { correctMaxScale, correctMinScale, rate} = this.s.options;
    const el = this.querySelector('.move-element')
    const z4 = this
    let distance, scaleAfterZoom, scaleBeforeZoom, currentScale
    let hammertime = new Hammer(z4);
    hammertime.get('pinch').set({ enable: true });
    let pinchObserver = false
    //以下測試用
    const div = document.querySelector('.pinch')
    hammertime.on('pinchstart', function(ev) {
      pinchObserver = true
      z4.s.options.pinchObserver = pinchObserver
      div.textContent = `雙指縮放 ${pinchObserver}`
    });
    
    //以下為開發
    hammertime.on('pinchout', function(ev) {
      currentScale = z4.s.options.currentScale // 當前縮放倍率
      distance = ev.distance //滑動距離
      scaleAfterZoom = currentScale * (1 + rate * distance * .1)
      if (scaleAfterZoom >= correctMaxScale ) scaleAfterZoom = correctMaxScale
      el.style.transform = `scale(${scaleAfterZoom})`
      z4.s.options.currentScale = scaleAfterZoom
    });
    hammertime.on('pinchin', function(ev) {
      currentScale = z4.s.options.currentScale // 當前縮放倍率
      distance = ev.distance //滑動距離
      scaleAfterZoom = currentScale / (1 + rate * distance * .1)
      if (scaleAfterZoom <= correctMinScale ) scaleAfterZoom = correctMinScale
      el.style.transform = `scale(${scaleAfterZoom})`
      z4.s.options.currentScale = scaleAfterZoom
    });
    hammertime.on('pinchend', function (ev) {
      pinchObserver = false
      z4.s.options.pinchObserver = pinchObserver
      div.textContent = `雙指縮放 ${pinchObserver}`
    })
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
      scaleElement.style.transform = `scale(${startScale})`
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
      scaleElement.style.transform = `scale(${startScale})`
    })
    
    reset.addEventListener('click', function (e) {
      e.preventDefault();
      self.s.options.currentScale = originalScale
      scaleElement.style.transform = `scale(${originalScale})`
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
          this.style.transform = `scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
          console.log(z4.s.options);
        }
      })
      element.addEventListener('mouseleave', function () {
        this.style.transform = `scale(${originalScale})`
        z4.s.options.currentScale = z4.s.options.originalScale
        console.log(z4.s.options);
      })
    } else {
      element.addEventListener(event, function () {
        if (z4.s.options.currentScale < correctMaxScale) {
          this.style.transform = `scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
          console.log(z4.s.options);
        } else {
          this.style.transform = `scale(${originalScale})`
          z4.s.options.currentScale = z4.s.options.originalScale
          console.log(z4.s.options);
        }
      })
    }
    
  }

  //手機版事件縮放
  eventZoomRWD() {
    if (!this.s.options.isMobileDevice) return
    //宣告
    const { event, correctMaxScale, originalScale } = this.s.options
    const element = this.querySelector('.move-element')
    const z4 = this
    let hammertime = new Hammer(element);
    switch (event) {
      case 'click':
        hammertime.on('tap', function(ev) {
          if (z4.s.options.currentScale < z4.s.options.correctMaxScale) {
            element.style.transform = `scale(${correctMaxScale})`
            z4.s.options.currentScale = z4.s.options.correctMaxScale
          } else {
            element.style.transform = `scale(${originalScale})`
            z4.s.options.currentScale = z4.s.options.originalScale
          }
        });
      break;
      case 'dblclick':
        var mc = new Hammer.Manager(element);
        mc.add( new Hammer.Tap({ taps: 2 }) );
        mc.on('tap', function(ev) {
          if (z4.s.options.currentScale < z4.s.options.correctMaxScale) {
            element.style.transform = `scale(${correctMaxScale})`
            z4.s.options.currentScale = z4.s.options.correctMaxScale
          } else {
            element.style.transform = `scale(${originalScale})`
            z4.s.options.currentScale = z4.s.options.originalScale
          }
        });
      break;
      case 'hover':
        hammertime.on('press', function(ev) {
          element.style.transform = `scale(${correctMaxScale})`
          z4.s.options.currentScale = z4.s.options.correctMaxScale
        });
        hammertime.on('pressup', function(ev) {
          element.style.transform = `scale(${originalScale})`
          z4.s.options.currentScale = z4.s.options.originalScale
        });
      break;
    }

  }

  //初始位置設定, 取得初始元素寬高
  #setPosition(){
    const { currentScale, element } = this.s.options
    const el = this.querySelector(element)
    let correctLeft, correctTop
    const elWidth = el.offsetWidth
    const elHeight = el.offsetHeight

    correctLeft = elWidth * ( 1 - currentScale) / -2
    correctTop = elHeight * ( 1 - currentScale) / -2

    

    el.style.left = `${correctLeft}px`
    el.style.top = `${correctTop}px`
    
    this.s.options.z4Width = this.offsetWidth
    this.s.options.z4Height = this.offsetHeight
    this.s.options.elWidthBefore = elWidth
    this.s.options.elHeightBefore = elHeight
    this.s.options.elWidthAfter = elWidth * currentScale
    this.s.options.elHeightAfter = elHeight * currentScale
    this.s.options.distanceX = correctLeft
    this.s.options.distanceY = correctTop
  }

  //位移
  move(){
    //宣告
    const canTouchStart = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
    const canTouchEnd = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
    const canTouchMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';

    const {element, container, currentScale, originalScale} = this.s.options
    const obj = this.querySelector(element)
    const z4 = this
    let isMove, abs_x, abs_y, distanceX, distanceY
    let correctCurrentScale = currentScale
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
        if(z4.s.options.pinchObserver) return
        if (isMove) {
          if(canTouchMove == 'touchmove') {
            distanceX = event.targetTouches[0].pageX - abs_x
            distanceY = event.targetTouches[0].pageY - abs_y
          } else {
            distanceX = event.pageX - abs_x
            distanceY = event.pageY - abs_y
          }
        }
        
        
        switch (container) {
          case 'inside':
            //當前縮放
            correctCurrentScale = z4.s.options.currentScale

            //縮放後的寬高
            let scaledObjWidth = obj.offsetWidth * correctCurrentScale
            let scaledObjHeight = obj.offsetHeight * correctCurrentScale

            //縮放後的寬高 - 物件寬高 / 2
            let halfDeltaWidth = (scaledObjWidth - obj.offsetWidth) / 2
            let halfDeltaHeight = (scaledObjHeight - obj.offsetHeight) / 2
            //正確left, top距離計算
            let correctLeft = distanceX - halfDeltaWidth
            let correctTop = distanceY - halfDeltaHeight

            //判斷是否碰到邊界

            //x軸
            if((scaledObjWidth + correctLeft) >= z4.offsetWidth) {
              distanceX = (z4.offsetWidth - scaledObjWidth) + halfDeltaWidth
            }
            if (distanceX <= halfDeltaWidth) distanceX = halfDeltaWidth

            //y軸
            if((scaledObjHeight + correctTop) >= z4.offsetHeight) {
              distanceY = (z4.offsetHeight - scaledObjHeight) + halfDeltaHeight
            }
            if (distanceY<= halfDeltaHeight) distanceY = halfDeltaHeight

            obj.style.left = `${ distanceX }px`
            obj.style.top = `${ distanceY }px`
            break;
        
          case 'free':
            obj.style.left = `${ distanceX }px`
            obj.style.top = `${ distanceY }px`
            break;
        }
        this.s.options.distanceX = distanceX
        this.s.options.distanceY = distanceY
    })
      
    })


    this.addEventListener(canTouchEnd, function () {
      isMove = false
    })
    
  }
  
  //設定邊界
  #freeContainer() {
    const { container } = this.s.options;
    if (container === 'free') {
      this.style.overflow = 'hidden'
    }
  }
  //demo
  demo() {
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

}();
/******/ })()
;