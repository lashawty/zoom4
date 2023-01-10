export default {
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
};
