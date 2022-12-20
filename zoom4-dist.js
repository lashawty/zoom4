class Zoom4 extends HTMLElement{constructor(){super(),this.scale=1}connectedCallback(){if(this.hasAttribute("option")){switch(this.getAttribute("option")){case"zoom":this.onwheel=e=>{this.zoom(e)},this.resetZoom();break;case"move":this.move()}}else console.error('zoom-element 記得加上 option屬性 例如option="zoom"')}disconnectedCallback(){console.log("removed")}zoom(e){e.preventDefault(),this.scale+=-.01*e.deltaY,this.scale=Math.min(Math.max(.125,this.scale),4),this.style.transform=`scale(${this.scale})`}resetZoom(){const e=document.querySelector(".test2"),t=document.querySelector("zoom-element");e.addEventListener("click",(function(){t.scale=1,t.style.transform="scale(1)"}))}move(){const e=document.createElement("div");this.appendChild(e),e.className="move-element";const t="ontouchstart"in document.documentElement?"touchstart":"mousedown",o="ontouchend"in document.documentElement?"touchend":"mouseup",n="ontouchmove"in document.documentElement?"touchmove":"mousemove",s=this.querySelector(".move-element"),l=this.querySelector(".left"),c=this.querySelector(".top");l.innerHTML=`Left ${s.offsetLeft} px`,c.innerHTML=`Top ${s.offsetTop} px`;let i,a,m;this.addEventListener(t,(function(e){e.preventDefault(),i=!0,"touchstart"==t?(a=e.originalEvent.targetTouches[0].pageX-s.offsetLeft,m=e.originalEvent.targetTouches[0].pageY-s.offsetTop):(a=e.pageX-s.offsetLeft,m=e.pageY-s.offsetTop),s.addEventListener(n,(function(e){if(i)if("touchmove"==n){let t=e.originalEvent.targetTouches[0].pageX-a,o=e.originalEvent.targetTouches[0].pageY-m;s.style.left=`${t}px`,s.style.top=`${o}px`}else{let t=e.pageX-a,o=e.pageY-m;s.style.left=`${t}px`,s.style.top=`${o}px`}l.innerHTML=`${s.style.left}`,c.innerHTML=`${s.style.top}`}))})),this.addEventListener("mouseleave",(function(){console.log("mouseleave"),i=!1})),this.addEventListener(o,(function(){console.log("mouseup"),i=!1}))}}customElements.define("zoom-element",Zoom4);
//# sourceMappingURL=zoom4-dist.js.map