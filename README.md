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
(參考: https://xwadex.com/vyv/panjit/@www/views/html/application/application_list.html)


* 參考功能連結：[Panzoom DEMO](https://timmywil.com/panzoom/demo/)
* 參考專案：[Mingleurn](https://xwadex.com/vyv/mingleurn/@www/dist/views/tw/content/customized.html)
* 開發網頁連結：[Develope DEMO](https://lashawty.github.io/zoom4/)



###### tags: zoom4