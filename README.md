# ZOOM 4 Demo

###### tags: zoom4

![](https://i.imgur.com/dPu9pG2.png)

## 安裝

**需另外載入手機的事件監聽套件** [hammerjs](https://hammerjs.github.io/getting-started/)

即可直接複製 

[zoom4.js](https://github.com/lashawty/zoom4/blob/main/src/js/zoom4.js)
[options.js](https://github.com/lashawty/zoom4/blob/main/src/js/options.js)
[zoom4.sass](https://github.com/lashawty/zoom4/blob/main/src/sass/zoom4.sass)

## 使用方式

**Demo Pug**

```
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(http-equiv="X-UA-Compatible", content="IE=edge")
    meta(name="viewport", content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1")
    title ZOOM 4 Demo
    link(href="./css/style.css", rel="stylesheet") //載入zoom4.sass (需import)
    link(href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&family=Noto+Sans+TC:wght@400;700&display=swap", rel="stylesheet")
    
    
  body
    // 可設定條件
    // 滾輪縮放 scale="on/off" 若為on 可另外設置 key-combine="on/off" 手機版可測試雙指縮放
    // 最大最小值 min-scale="數字" max-scale="數字" 若min-scale >= max-scale會噴錯
    // 綁定按鈕 button = "has-button/none" 若要設置button的名字請至options
    // 事件縮放 event = "hover/click/dblclick/none"
    // 當 event="click" 的時候 如果點擊元素時"移動滑鼠"，不會觸發縮放
    // 範圍 container="inside/free"

    zoom-element(scale="on" key-combine="on" container="inside" event="dblclick" min-scale=".2" max-scale="20" button="has-button")
      .move-element // 被移動的元素 必須有寬高 可自行設定
        img(src="./assets/img.jpg", alt="alt")
     
    // 以下為demo UI
    .demo
      h1 ZOOM 4 DEMO
      h4 僅按鈕區塊可點擊
      .button-wrap
        p.bold.title 按鈕區塊：
        .zoom-buttons
          .zoom-plus 
          .zoom-minus 
          .zoom-reset RESET
      .set-value
        p.bold.title 當前最大值、最小值：
        .wrap
          p Max Scale :
          input.max-value(placeholder="預設值 4")

          p Min Scale :
          input.min-value(placeholder="預設值 0.1")

      .event.button-group
        p.bold.title Event
        ul
          li.click Click
          li.hover Hover
          li.doubleclick Double Click
          li.none No Event
      .container.button-group
        p.bold.title Container
        ul
          li.container-inside Inside
          li.container-free Free

      //開啟時加上.on   
      .wheel.button-group
        p.bold.title Scale
        ul
          li.wheel-on on
          li.wheel-off off
        .key-combine.button-group
          p.bold.title Key-Combine (press "shift")
          ul
            li.key-on on
            li.key-off off
    
    .pinch 手機版測試用
    script(src="./js/hammer.min.js")
    script(src="./js/app-dist.js")
    script(type="module" src="./js/zoom4.js")
```


### 因為使用的是web-component，下載後即可於html檔案(本套件使用pug開發)使用，以下為可設定數值(option.js可直接修改預設值)

```
container: 'inside', // 是否可以超出邊界
scale: 'off', // 是否可以縮放 on || off
minScale: '0.1',
maxScale: '4',
button: 'has-button', // 是否綁定按鈕控制放大縮小 has-button || none
rate: 1,
event: 'none', // click || dblclick || hover || none 
combineKey: 'off',
element: '.move-element',
buttonGroup: '.zoom-buttons',
plusButton: '.zoom-plus',
minusButton: '.zoom-minus',
resetButton: '.zoom-reset',
```

### 直接改標籤：

```
zoom-element(scale="on" key-combine="on" container="inside" event="dblclick" min-scale=".2" max-scale="20" button="has-button")
    .move-element //被移動or縮放的元素
```

### 注意事項

zoom-element為父層元素，子層需放入 .move-element，並另外針對使用情境設置css

