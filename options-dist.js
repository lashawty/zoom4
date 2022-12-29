export default {
  SETTINGS: {
    container: 'inside', // 是否可以超出邊界
    scale: 'none', // 是否可以縮放 zoom || none
    minScale: '0.1',
    maxScale: '4',
    button: 'has-button', // 是否綁定按鈕控制放大縮小 has-button || none
    // eventListener : 'mousewheel', 
    //   // 設定縮放功能的事件 doubleclick || mouseenter || mousewheel  || mouseenter
    // keyboardCombine: 'false',

    eventListener: {
      event: 'mousewheel',
      keyboardCombine: 'false'
    }
  },
};
