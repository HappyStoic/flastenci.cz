var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let a,c;function i(t,e){return a||(a=document.createElement("a")),a.href=e,t===a.href}function u(e,n,o){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}function l(t,e){t.appendChild(e)}function d(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode&&t.parentNode.removeChild(t)}function h(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function m(){return p(" ")}function g(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function $(t){return function(e){return e.preventDefault(),t.call(this,e)}}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t,e,n){t.classList[n?"add":"remove"](e)}function y(t){c=t}function k(){if(!c)throw new Error("Function called outside component initialization");return c}function v(t){k().$$.on_mount.push(t)}function x(){const t=k();return(e,n,{cancelable:o=!1}={})=>{const s=t.$$.callbacks[e];if(s){const r=function(t,e,{bubbles:n=!1,cancelable:o=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,o,e),s}(e,n,{cancelable:o});return s.slice().forEach((e=>{e.call(t,r)})),!r.defaultPrevented}return!0}}const j=[],_=[];let E=[];const C=[],M=Promise.resolve();let z=!1;function I(t){E.push(t)}const A=new Set;let F=0;function L(){if(0!==F)return;const t=c;do{try{for(;F<j.length;){const t=j[F];F++,y(t),P(t.$$)}}catch(t){throw j.length=0,F=0,t}for(y(null),j.length=0,F=0;_.length;)_.pop()();for(let t=0;t<E.length;t+=1){const e=E[t];A.has(e)||(A.add(e),e())}E.length=0}while(j.length);for(;C.length;)C.pop()();z=!1,A.clear(),y(t)}function P(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(I)}}const O=new Set;let S;function R(){S={r:0,c:[],p:S}}function T(){S.r||o(S.c),S=S.p}function q(t,e){t&&t.i&&(O.delete(t),t.i(e))}function N(t,e,n,o){if(t&&t.o){if(O.has(t))return;O.add(t),S.c.push((()=>{O.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}else o&&o()}function U(t,e){N(t,1,1,(()=>{e.delete(t.key)}))}function H(t){t&&t.c()}function W(t,n,r,a){const{fragment:c,after_update:i}=t.$$;c&&c.m(n,r),a||I((()=>{const n=t.$$.on_mount.map(e).filter(s);t.$$.on_destroy?t.$$.on_destroy.push(...n):o(n),t.$$.on_mount=[]})),i.forEach(I)}function B(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];E.forEach((o=>-1===t.indexOf(o)?e.push(o):n.push(o))),n.forEach((t=>t())),E=e}(n.after_update),o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function D(t,e){-1===t.$$.dirty[0]&&(j.push(t),z||(z=!0,M.then(L)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(e,s,r,a,i,u,l,d=[-1]){const h=c;y(e);const p=e.$$={fragment:null,ctx:[],props:u,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(h?h.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:s.target||h.$$.root};l&&l(p.root);let m=!1;if(p.ctx=r?r(e,s.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return p.ctx&&i(p.ctx[t],p.ctx[t]=s)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](s),m&&D(e,t)),n})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!a&&a(p.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);p.fragment&&p.fragment.l(t),t.forEach(f)}else p.fragment&&p.fragment.c();s.intro&&q(e.$$.fragment),W(e,s.target,s.anchor,s.customElement),L()}y(h)}class J{$destroy(){B(this,1),this.$destroy=t}$on(e,n){if(!s(n))return t;const o=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return o.push(n),()=>{const t=o.indexOf(n);-1!==t&&o.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function K(e){let n,s,r,a,c,u,p,y,k;return{c(){n=h("div"),s=h("div"),a=m(),c=h("div"),u=h("img"),b(s,"class",r="card-face card-face-front "+e[0]+" svelte-hfinwn"),i(u.src,p=e[1].img)||b(u,"src",p),b(u,"alt","Card image"),b(u,"class","svelte-hfinwn"),b(c,"class","card-face card-face-back svelte-hfinwn"),b(n,"class","card svelte-hfinwn"),w(n,"card-finished",e[3]),w(n,"flipped",e[2])},m(t,o){d(t,n,o),l(n,s),l(n,a),l(n,c),l(c,u),y||(k=[g(n,"touchstart",$(e[4])),g(n,"click",e[4])],y=!0)},p(t,[e]){1&e&&r!==(r="card-face card-face-front "+t[0]+" svelte-hfinwn")&&b(s,"class",r),2&e&&!i(u.src,p=t[1].img)&&b(u,"src",p),8&e&&w(n,"card-finished",t[3]),4&e&&w(n,"flipped",t[2])},i:t,o:t,d(t){t&&f(n),y=!1,o(k)}}}function Q(t,e,n){const o=x();let s,{cardId:r}=e,{color:a}=e,{rsc:c}=e,i=!1,u=!1;function l(){s&&s.play()}return v((()=>{c.audio&&(s=new Audio(c.audio))})),t.$$set=t=>{"cardId"in t&&n(5,r=t.cardId),"color"in t&&n(0,a=t.color),"rsc"in t&&n(1,c=t.rsc)},[a,c,i,u,function(){u?l():i||(n(2,i=!0),console.log(`Flipped card ${r}: ${i}`),o("shown",{rsc:c,hideCallback:()=>{n(2,i=!1)},cardFinishedCallback:()=>{n(3,u=!0)},playIfPossibleCallback:l}))},r]}class V extends J{constructor(t){super(),G(this,t,Q,K,r,{cardId:5,color:0,rsc:1})}}const X=[];function Y(e,n=t){let o;const s=new Set;function a(t){if(r(e,t)&&(e=t,o)){const t=!X.length;for(const t of s)t[1](),X.push(t,e);if(t){for(let t=0;t<X.length;t+=2)X[t][0](X[t+1]);X.length=0}}}return{set:a,update:function(t){a(t(e))},subscribe:function(r,c=t){const i=[r,c];return s.add(i),1===s.size&&(o=n(a)||t),r(e),()=>{s.delete(i),0===s.size&&o&&(o(),o=null)}}}}const Z=[{img:"assets/zeman.jpg",audio:"assets/kunda.mp3"},{img:"assets/babis.jpg",audio:"assets/troskujsemtoposral.mp3"},{img:"assets/skromach.jpg",audio:"assets/skromach-ohne.mp3"},{img:"assets/rozner.jpg",audio:"assets/rozner-kritizovat.mp3"},{img:"assets/kalousek.jpg",audio:"assets/kalousek-kokoti.mp3"},{img:"assets/schillerova.jpg",audio:"assets/schillerova-we-will-see.mp3"},{img:"assets/ondracek.jpg",audio:"assets/ondracek-revoluce.mp3"},{img:"assets/volny.jpg",audio:"assets/volny-flakanec.mp3"},{img:"assets/malacova.jpg",audio:"assets/malacova-plytka.mp3"},{img:"assets/paroubek.jpg",audio:"assets/paroubek-ufouni.mp3"},{img:"assets/pitomio.jpg",audio:"assets/pitomio-plysaci.mp3"},{img:"assets/sobotka.jpg",audio:"assets/sobotka-english.mp3"},{img:"assets/foldyna.jpg",audio:"assets/foldyna-vlastenec.mp3"},{img:"assets/novotny.jpg",audio:"assets/novotny-sparta.mp3"},{img:"assets/klaus.jpg"},{img:"assets/schwarzenberg.jpg"},{img:"assets/vondracek.jpg"},{img:"assets/bartos.jpg"}],tt={subscribe:Y(void 0,(async function(t){let e=[];try{const n=Z.map((async t=>{const e=fetch(t.img).then((t=>t.blob())).then((t=>URL.createObjectURL(t))),n=t.audio?fetch(t.audio).then((t=>t.blob())).then((t=>URL.createObjectURL(t))):null,[o,s]=await Promise.all([e,n]);return{img:o,audio:s}}));e=await Promise.all(n),t(e)}catch(t){alert(t)}})).subscribe};function et(t,e,n){const o=t.slice();return o[7]=e[n],o}function nt(t,e){let n,o,s;return o=new V({props:{color:st(e[7]),cardId:e[7],rsc:e[1]()}}),o.$on("shown",e[2]),{key:t,first:null,c(){n=p(""),H(o.$$.fragment),this.first=n},m(t,e){d(t,n,e),W(o,t,e),s=!0},p(t,n){e=t;const s={};1&n&&(s.color=st(e[7])),1&n&&(s.cardId=e[7]),o.$set(s)},i(t){s||(q(o.$$.fragment,t),s=!0)},o(t){N(o.$$.fragment,t),s=!1},d(t){t&&f(n),B(o,t)}}}function ot(t){let e,n,s,r=[],a=new Map,c=t[0];const i=t=>t[7];for(let e=0;e<c.length;e+=1){let n=et(t,c,e),o=i(n);a.set(o,r[e]=nt(o,n))}return{c(){e=h("div"),n=h("div");for(let t=0;t<r.length;t+=1)r[t].c();b(n,"class","container svelte-1o9rxor"),b(e,"class","outer-container svelte-1o9rxor")},m(t,o){d(t,e,o),l(e,n);for(let t=0;t<r.length;t+=1)r[t]&&r[t].m(n,null);s=!0},p(t,[e]){7&e&&(c=t[0],R(),r=function(t,e,n,s,r,a,c,i,u,l,d,f){let h=t.length,p=a.length,m=h;const g={};for(;m--;)g[t[m].key]=m;const $=[],b=new Map,w=new Map,y=[];for(m=p;m--;){const t=f(r,a,m),o=n(t);let i=c.get(o);i?s&&y.push((()=>i.p(t,e))):(i=l(o,t),i.c()),b.set(o,$[m]=i),o in g&&w.set(o,Math.abs(m-g[o]))}const k=new Set,v=new Set;function x(t){q(t,1),t.m(i,d),c.set(t.key,t),d=t.first,p--}for(;h&&p;){const e=$[p-1],n=t[h-1],o=e.key,s=n.key;e===n?(d=e.first,h--,p--):b.has(s)?!c.has(o)||k.has(o)?x(e):v.has(s)?h--:w.get(o)>w.get(s)?(v.add(o),x(e)):(k.add(s),h--):(u(n,c),h--)}for(;h--;){const e=t[h];b.has(e.key)||u(e,c)}for(;p;)x($[p-1]);return o(y),$}(r,e,i,1,t,c,a,n,U,nt,null,et),T())},i(t){if(!s){for(let t=0;t<c.length;t+=1)q(r[t]);s=!0}},o(t){for(let t=0;t<r.length;t+=1)N(r[t]);s=!1},d(t){t&&f(e);for(let t=0;t<r.length;t+=1)r[t].d()}}}function st(t){return t%6<2?"white":t%6<4?"red":"blue"}function rt(t,e,n){let o;u(t,tt,(t=>n(6,o=t)));let s,r=[],a=null,c=null;return v((()=>{s=o.flatMap((t=>[t,t])),n(0,r=Array.from({length:36},((t,e)=>e)))})),[r,function(){const t=Math.floor(Math.random()*s.length);return s.splice(t,1)[0]},function(t){let e=t.detail;if(null==a)return c&&(c(),c=null),void(a=e);if(a.rsc==e.rsc)e.cardFinishedCallback(),a.cardFinishedCallback(),a.playIfPossibleCallback(),a=null;else{let t=setTimeout(e.hideCallback,5e3),n=setTimeout(a.hideCallback,5e3),o=e.hideCallback,s=a.hideCallback;c=()=>{clearTimeout(t),clearTimeout(n),o(),s()},a=null}}]}class at extends J{constructor(t){super(),G(this,t,rt,ot,r,{})}}function ct(e){let n,o,s;return{c(){n=h("canvas"),b(n,"class","svelte-15nsus0")},m(t,r){d(t,n,r),e[2](n),o||(s=g(n,"resize",e[1]),o=!0)},p:t,i:t,o:t,d(t){t&&f(n),e[2](null),o=!1,s()}}}function it(t,e,n){let o,s,r,a=[];function c(){s.clearRect(0,0,o.width,o.height),a.forEach((t=>{t.y+=2,t.rotation+=.025,t.y>o.height&&(t.y=-50,t.x=Math.random()*o.width),s.save(),s.translate(t.x+35,t.y+25),s.rotate(t.rotation),s.drawImage(t.image,-35,-25,70,50),s.restore()})),requestAnimationFrame(c)}return v((()=>{r=Math.round(window.innerWidth*window.innerHeight/23e3),n(0,o.width=window.innerWidth,o),n(0,o.height=window.innerHeight,o),s=o.getContext("2d");for(let t=0;t<r;t++){const t=new Image;t.src="/assets/cz-flag.svg",t.onload=()=>{a.push({x:Math.random()*o.width,y:-Math.random()*o.height,rotation:Math.random()*Math.PI*2,image:t})}}return requestAnimationFrame(c),()=>{var t;k().$$.on_destroy.push(t)}})),[o,function(){n(0,o.width=window.innerWidth,o),n(0,o.height=window.innerHeight,o)},function(t){_[t?"unshift":"push"]((()=>{o=t,n(0,o)}))}]}class ut extends J{constructor(t){super(),G(this,t,it,ct,r,{})}}function lt(e){let n,o;return{c(){n=h("div"),o=p(e[0]),b(n,"class","exit-note alert alert-success shadow-sm svelte-3zju3q"),b(n,"role","alert")},m(t,e){d(t,n,e),l(n,o)},p(t,[e]){1&e&&function(t,e){e=""+e,t.data!==e&&(t.data=e)}(o,t[0])},i:t,o:t,d(t){t&&f(n)}}}function dt(t,e,n){let{text:o="Site under construction 🏗️"}=e;return t.$$set=t=>{"text"in t&&n(0,o=t.text)},[o]}class ft extends J{constructor(t){super(),G(this,t,dt,lt,r,{text:0})}}function ht(e){let n,o;return n=new at({}),{c(){H(n.$$.fragment)},m(t,e){W(n,t,e),o=!0},p:t,i(t){o||(q(n.$$.fragment,t),o=!0)},o(t){N(n.$$.fragment,t),o=!1},d(t){B(n,t)}}}function pt(t){let e,n,o,s;return e=new ut({}),o=new ft({props:{text:t[1]}}),{c(){H(e.$$.fragment),n=m(),H(o.$$.fragment)},m(t,r){W(e,t,r),d(t,n,r),W(o,t,r),s=!0},p(t,e){const n={};2&e&&(n.text=t[1]),o.$set(n)},i(t){s||(q(e.$$.fragment,t),q(o.$$.fragment,t),s=!0)},o(t){N(e.$$.fragment,t),N(o.$$.fragment,t),s=!1},d(t){B(e,t),t&&f(n),B(o,t)}}}function mt(t){let e,n,s,r,a,c;const i=[pt,ht],u=[];function l(t,e){return t[0]?1:0}return n=l(t),s=u[n]=i[n](t),{c(){e=h("main"),s.c()},m(o,s){d(o,e,s),u[n].m(e,null),r=!0,a||(c=[g(window,"touchstart",$(t[2])),g(window,"keydown",t[2]),g(window,"click",t[2])],a=!0)},p(t,[o]){let r=n;n=l(t),n===r?u[n].p(t,o):(R(),N(u[r],1,1,(()=>{u[r]=null})),T(),s=u[n],s?s.p(t,o):(s=u[n]=i[n](t),s.c()),q(s,1),s.m(e,null))},i(t){r||(q(s),r=!0)},o(t){N(s),r=!1},d(t){t&&f(e),u[n].d(),a=!1,o(c)}}}function gt(t,e,n){let o,s,r;u(t,tt,(t=>n(4,r=t)));let a=!1;return t.$$.update=()=>{16&t.$$.dirty&&n(3,o=void 0!==r),8&t.$$.dirty&&n(1,s=o?"press any key to continue":"loading...")},[a,s,function(){o&&n(0,a=!0)},o,r]}return new class extends J{constructor(t){super(),G(this,t,gt,mt,r,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
