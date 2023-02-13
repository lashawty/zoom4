# ZOOM4 開發紀錄

### 基本要有的功能

* 範圍(container): 可移出範圍外(outside) / 只能在範圍內移動(inside) 設定拖拉的範圍 - 預設為 inside
* 初始縮放大小(startScale): Number 0.1~4.0
* 預設值為載入時判斷內容寬高
* 如果比拖拉縮放的範圍大 -> 縮小至可以完整顯示內容
如果比拖拉縮放的範圍小 -> 1 維持原大小不做變動
縮放最小(minScale): Number 0.1~4.0 - 預設為1
縮放最大(maxScale): Number 0.1~4.0 - 預設為4

* 可獨立綁定按鈕去控制放大/縮小
* 可設定縮放功能的事件 doubleclick / mouseenter / mousewheel
doubleclick, mouseenter 只能兩種倍率做切換，到行動裝置時統一變成雙指縮放

* mousewheel 可設定開啟滑鼠滾輪放大/縮小
或開啟按住組合鍵 + 滾輪才能縮放 (Windows - Ctrl, MacOS - command)
可傳入布林或物件，ex: mousewheel :true / mousewheel: { keyboardCombine: true}
如果設定組合鍵，滑鼠在範圍內滾動時需要顯示操作提示


* 開發網頁連結：[Develope DEMO](https://xwadex.com/_pvd_/@WDD-F2E/zoom4/index.html)

### 已完成功能

1. 拖拉功能
2. 滑鼠滾輪縮放 scale="on/off" 手機版無功能
3. 滾輪縮放可設定是否使用組合鍵 key-combine="on/off" shift 按住才有縮放功能 手機版為兩指縮放
4. 最大、最小縮放設定 ex: (min-scale="0.5" max-scale="10") 預設值 0.1~4
5. 若 container="inside" 最終 max-scale 不會超過當前父元素寬高
6. 是否綁定按鈕 button="has-button/none" 放大/縮小/回到預設值 結構請見"按鈕區塊 若要更改 class 請至 options 修改
7. 綁定事件兩倍率切換 // click, dblclick, hover, none
8. 可客製化元素，element, buttonGroup, plusButton, minusButton, resetButton (按鈕元件外層須加上buttonGroup不然會無法query)
### 問題
1. container="inside" 時，若於邊界放大需另外計算超出部分(目前已完成拖拉事件的計算，可測試在中間放大後的拖拉事件)


###### tags: zoom4
