var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function c(t,n){t.appendChild(n)}function s(t,n,e){t.insertBefore(n,e||null)}function u(t){t.parentNode&&t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}let l;function h(t){l=t}function $(){if(!l)throw new Error("Function called outside component initialization");return l}const m=[],p=[];let g=[];const w=[],y=Promise.resolve();let _=!1;function x(t){g.push(t)}const b=new Set;let v=0;function E(){if(0!==v)return;const t=l;do{try{for(;v<m.length;){const t=m[v];v++,h(t),k(t.$$)}}catch(t){throw m.length=0,v=0,t}for(h(null),m.length=0,v=0;p.length;)p.pop()();for(let t=0;t<g.length;t+=1){const n=g[t];b.has(n)||(b.add(n),n())}g.length=0}while(m.length);for(;w.length;)w.pop()();_=!1,b.clear(),h(t)}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(x)}}const M=new Set;let A;function N(t,n){t&&t.i&&(M.delete(t),t.i(n))}function O(t,n,e,o){if(t&&t.o){if(M.has(t))return;M.add(t),A.c.push((()=>{M.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}else o&&o()}function j(t){t&&t.c()}function q(t,e,i,c){const{fragment:s,after_update:u}=t.$$;s&&s.m(e,i),c||x((()=>{const e=t.$$.on_mount.map(n).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(x)}function z(t,n){const e=t.$$;null!==e.fragment&&(!function(t){const n=[],e=[];g.forEach((o=>-1===t.indexOf(o)?n.push(o):e.push(o))),e.forEach((t=>t())),g=n}(e.after_update),o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function C(t,n){-1===t.$$.dirty[0]&&(m.push(t),_||(_=!0,y.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function F(n,r,i,c,s,a,f,d=[-1]){const $=l;h(n);const m=n.$$={fragment:null,ctx:[],props:a,update:t,not_equal:s,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||($?$.$$.context:[])),callbacks:e(),dirty:d,skip_bound:!1,root:r.target||$.$$.root};f&&f(m.root);let p=!1;if(m.ctx=i?i(n,r.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return m.ctx&&s(m.ctx[t],m.ctx[t]=r)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](r),p&&C(n,t)),e})):[],m.update(),p=!0,o(m.before_update),m.fragment=!!c&&c(m.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);m.fragment&&m.fragment.l(t),t.forEach(u)}else m.fragment&&m.fragment.c();r.intro&&N(n.$$.fragment),q(n,r.target,r.anchor,r.customElement),E()}h($)}class H{$destroy(){z(this,1),this.$destroy=t}$on(n,e){if(!r(e))return t;const o=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function I(n){let e,o,r;return{c(){e=a("canvas"),d(e,"class","svelte-15nsus0")},m(t,i){var c,u,a,f;s(t,e,i),n[2](e),o||(c=e,u="resize",a=n[1],c.addEventListener(u,a,f),r=()=>c.removeEventListener(u,a,f),o=!0)},p:t,i:t,o:t,d(t){t&&u(e),n[2](null),o=!1,r()}}}function S(t,n,e){let o,r,i,c=[];function s(){r.clearRect(0,0,o.width,o.height),c.forEach((t=>{t.y+=2,t.rotation+=.025,t.y>o.height&&(t.y=-50,t.x=Math.random()*o.width),r.save(),r.translate(t.x+35,t.y+25),r.rotate(t.rotation),r.drawImage(t.image,-35,-25,70,50),r.restore()})),requestAnimationFrame(s)}var u;return u=()=>{i=Math.round(window.innerWidth*window.innerHeight/23e3),e(0,o.width=window.innerWidth,o),e(0,o.height=window.innerHeight,o),r=o.getContext("2d");for(let t=0;t<i;t++){const t=new Image;t.src="/assets/cz-flag.svg",t.onload=()=>{c.push({x:Math.random()*o.width,y:-Math.random()*o.height,rotation:Math.random()*Math.PI*2,image:t})}}return requestAnimationFrame(s),()=>{var t;$().$$.on_destroy.push(t)}},$().$$.on_mount.push(u),[o,function(){e(0,o.width=window.innerWidth,o),e(0,o.height=window.innerHeight,o)},function(t){p[t?"unshift":"push"]((()=>{o=t,e(0,o)}))}]}class W extends H{constructor(t){super(),F(this,t,S,I,i,{})}}function L(n){let e,o;return{c(){e=a("div"),o=f("Site under construction 🏗️"),d(e,"class","exit-note alert alert-success shadow-sm  svelte-1isoyh1"),d(e,"role","alert")},m(t,n){s(t,e,n),c(e,o)},p:t,i:t,o:t,d(t){t&&u(e)}}}class P extends H{constructor(t){super(),F(this,t,null,L,i,{})}}function B(n){let e,o,r,i,d;return o=new W({}),i=new P({}),{c(){e=a("main"),j(o.$$.fragment),r=f(" "),j(i.$$.fragment)},m(t,n){s(t,e,n),q(o,e,null),c(e,r),q(i,e,null),d=!0},p:t,i(t){d||(N(o.$$.fragment,t),N(i.$$.fragment,t),d=!0)},o(t){O(o.$$.fragment,t),O(i.$$.fragment,t),d=!1},d(t){t&&u(e),z(o),z(i)}}}return new class extends H{constructor(t){super(),F(this,t,null,B,i,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
