/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$1="?"+h,n=`<${o$1}>`,r=document,l=()=>r.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r.createTreeWalker(r,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$1)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

function isDirectory(item) {
    return item?.media_class === "directory";
}
function isImage(item) {
    return item?.media_class === "image";
}
function isVideo(item) {
    return item?.media_class === "video";
}
function isAudio(item) {
    return item?.media_class === "audio";
}

const folderIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>`;
const fileIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>`;
const imageIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M8 11l2.5 3 3.5-4.5L18 17H6z" />
    <circle cx="9" cy="7" r="1.5" stroke-width="2" />
  </svg>`;
const videoIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
    <rect x="3" y="7" width="12" height="10" rx="2" ry="2" stroke-width="2" />
  </svg>`;
const backIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="mec-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20 12H8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 6L6 12L12 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
const zoomIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="mec-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
    <path d="M4 9V4h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 9V4h-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 15v5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 15v5h-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
const nextIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="mec-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M7 4l7 8-7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 4l7 8-7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
const prevIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="mec-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M17 4l-7 8 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 4l-7 8 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
const closeIcon = x`
  <svg xmlns="http://www.w3.org/2000/svg" class="mec-button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

/**
 * @param {import('./card.js').MediaExplorerCard} card
*/
const renderTemplate = (card) => x`
  <ha-card>
    <div id="mec-card">
      
      <div id="mec-header">
        <div id="mec-header-browser-buttons" ?hidden="${card._playerOn}">
          <button class="mec-button" ?disabled="${card._pathList.length <= 1}" @click="${() => card.navigateBackward()}">${backIcon}</button>
        </div>
        <div id="mec-header-player-buttons" ?hidden="${!card._playerOn}">
          <button class="mec-button" @click="${() => card.closeFile()}">${closeIcon}</button>
          <button class="mec-button" @click=${() => card.toggleFullscreenPlayer()}>${zoomIcon}</button>
          <button class="mec-button" ?disabled="${card._openedFileIndex <= 0}" @click=${() => card.openFile(card._itemList[card._openedFileIndex-1],card._openedFileIndex-1)}>${prevIcon}</button>
          <button class="mec-button" ?disabled="${card._openedFileIndex >= card._itemList?.length-1}" @click=${() => card.openFile(card._itemList[card._openedFileIndex+1],card._openedFileIndex+1)}>${nextIcon}</button>
        </div>

        <div id="mec-header-title" ?hidden="${!card._title}"> ${card._title} </div>
        
        <div class="mec-header-txt-info" ?hidden="${card._playerOn || card._pathList.length <= 1}">${card._pathList.at(-1).replace(card._pathList[0],".")}</div>
        <div class="mec-header-txt-info" ?hidden="${!card._playerOn}">${card._openedFile?.title}</div>
      </div>
      
      <div id="mec-content">       

        <div id="mec-browser-content" ?hidden="${card._playerOn}">
          ${card._navigationLoading ? x`<div class="loading">Loading...</div>` : card._itemList.length ? getItemList(card) : x`<div class="p-4">No files found.</div>`}
        </div>

        <div id="mec-player-content" ?hidden="${!card._playerOn}">
          ${card._fileLoading ? 
            x`<div class="loading">Loading...</div>` :
            card._openedFileUrl && !card._playerFullScreenOn
            ? getPlayer(card._openedFile,card._openedFileUrl)
            : x`<div>I'm confused</div>`}
        </div>

      </div>
    </div>
  </ha-card>

  ${card._openedFileUrl && card._playerFullScreenOn
    ? x`
        <div id="fullscreen-player">
          <div class="fullscreen-overlay">
            ${getPlayer(card._openedFile,card._openedFileUrl)}
            <button class="fullscreen-close" @click="${() => card.toggleFullscreenPlayer()}">${closeIcon}</button>
          </div>
        </div>
    ` : null}
`;

/**
 * @param {import('./card.js').MediaExplorerCard} card
*/
const getItemList = (card) => x`
    ${card._itemList.map((item, index) => x`
      <div class="mec-browser-content-item" @click="${() => {card.openItem(item, index);}}">
        <div class="mec-browser-content-item-icon">
          ${isDirectory(item) ? folderIcon 
            : isImage(item) ? imageIcon 
            : isVideo(item) ? videoIcon 
            : fileIcon }
        </div>
        <div class="mec-browser-content-item-name">${item.title ?? "NA"}</div>
      </div>`
    )}
  `;

const getPlayer = (item, url) => x`
    ${isImage(item) ? x`<img src="${url}" alt="preview" />`
      : isVideo(item) ? x`<video src="${url}" controls autoplay></video>`
      : isAudio(item) ? x`<audio src="${url}" controls autoplay></audio>`
      : x`<a href="${url}" target="_blank">File not supported</a>`}
  `;

const cardStyle = i$3`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  ha-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
  }

  #mec-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

/* --------- HEADER -----------*/
  #mec-header {
    display: grid;
    padding: 0.5rem;
    grid-template-columns: 1fr auto 1fr;
    align-items: center; 
  }

  #mec-header-browser-buttons,
  #mec-header-player-buttons {
    display: flex;
    gap: 0.5rem;
    grid-column: 1;
  }
  #mec-header-browser-buttons[hidden],
  #mec-header-player-buttons[hidden] {
    display: none;
  }

  .mec-button {
    padding: 0.5rem;
    cursor: pointer;
    background: none;
    border: 1px solid var(--secondary-text-color, #ccc);
    color: var(--primary-text-color);
    border-radius: 50%;
    transition: background 0.2s;
  }
  .mec-button[disabled] {
    color: var(--disabled-text-color);
    border: 1px solid var(--disabled-text-color, #ccc);
    cursor: not-allowed;
    opacity: 0.6;
  }
  .mec-button-icon {
    width: var(--mdc-icon-size, 24px);
    height: var(--mdc-icon-size, 24px);
    display: block;
  }

  #mec-header-title {
    font-size: var(--paper-font-headline_-_font-size, 20px);
    color: var(--primary-text-color);
    grid-column: 2;
    text-align: center;
  }

  .mec-header-txt-info {
    margin: 0;
    color: var(--secondary-text-color);
    text-align: right;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    grid-column: 3;
  }
  mec-header-txt-info[hidden] {
    display: none;
  }

  @media (max-width: 600px) {
    #mec-header {
      grid-template-rows: 1fr auto 1fr;
      grid-template-columns: auto;
    }
    #mec-header-title {
      grid-row: 1;
      grid-column: initial;
    }
    #mec-header-browser-buttons,
    #mec-header-player-buttons {
      grid-row: 2;
      grid-column: initial;
    }
    .mec-header-txt-info {
      grid-row: 3;
      grid-column: initial;
      text-align: left;
    }
  }

/* --------- CONTENT -----------*/
  #mec-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-bottom: 0.5rem;
  }

  #mec-browser-content[hidden],
  #mec-player-content[hidden] {
    display: none;
  }

  #mec-browser-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
    padding: 0.5rem;
    overflow-y: auto;
    box-sizing: border-box;
  }
  @media (max-width: 600px) {
    #mec-browser-content {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  .mec-browser-content-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .mec-browser-content-item-icon {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mec-browser-content-item-name {
    text-align: center;
    word-break: break-word;
  }

  .loading {
    text-align: center;
    height: 100%;
    align-content: center;
  }

  /* --- PLAYER AREA --- */
  #mec-player-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  #mec-player-content img,
  #mec-player-content video,
  #mec-player-content audio {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 4px;
  }

  /* --- FULLSCREEN --- */
  #fullscreen-player {
    position: fixed;
    inset: 0;
    z-index: 9999;
  }

  .fullscreen-overlay {
    width: 100%;
    height: 100%;
    background: var(--card-background-color);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .fullscreen-overlay img,
  .fullscreen-overlay video,
  .fullscreen-overlay audio {
    width: 90%;
    height: auto;
    max-height: 90vh;
    object-fit: contain;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  }

  .fullscreen-close {
    position: absolute;
    top: 20px;
    right: 30px;    
    padding: 0.5rem;
    cursor: pointer;
    background: none;
    border: 1px solid var(--secondary-text-color, #ccc);
    color: var(--primary-text-color);
    border-radius: 50%;
  }
`;

class MediaExplorerCard extends i {

  static properties = {
    hass: {},
    config: {},
  };

  static styles = cardStyle;

  constructor() {
    super();
    this._pathList = [];
    this._itemList = [];
    this._playerOn = false;
    this._playerFullScreenOn = false;
    this._openedFile = null;
    this._openedFileUrl = null;
    this._openedFileIndex = null;
    this._navigationLoading = false;
    this._fileLoading = false;
  }

  setConfig(config) { 
    this.config = config; 
    
    this._pathList.push(config.start_path);
    this._title = config.title ? config.title : null;
  }

  getCardSize() { 
    return 3; 
  }

  firstUpdated() {
    this.getCurrentDirectoryItems();   
  }

  updated(changedProps) {
    super.updated(changedProps);
  }

  render() {
    return renderTemplate(this);
  }

  async getCurrentDirectoryItems() {
    this._navigationLoading = true;
    this._itemList = (await this.hass.callWS({ type: "media_source/browse_media", media_content_id: this._pathList.at(-1) })).children ?? [];
    this._navigationLoading = false;
    this.requestUpdate();
  }

  openItem(item,index) {

    if (isDirectory(item)) {
      this.navigateForward(item);
    } else {
      this.openFile(item,index);
    }
  }

  async openFile(item,index) {
    this._openedFileIndex = index;
    this._playerOn = true;
    this._fileLoading = true;
    this._openedFile = item;
    this._abortController = new AbortController();
    this.requestUpdate();
    const resolved = await this.hass.callWS({ type: "media_source/resolve_media", media_content_id: item.media_content_id});
    if (this._playerOn) { // Player is still on
      this._openedFileUrl = resolved.url;
      this._fileLoading = false;
    }
  }

  async navigateForward(item) {
      this._pathList.push(item.media_content_id);
      this._itemList = [];
      this.getCurrentDirectoryItems();
  }

  async navigateBackward() {
      if (this._pathList.length <= 1) return;
      this._pathList.pop();
      this._itemList = [];
      this.getCurrentDirectoryItems();
  }

  closeFile() {
    this._playerOn = false;
    this._openedFile = null;
    this._openedFileUrl = null;
    this._openedFileIndex = null;
    this.requestUpdate();
  }
  
  toggleFullscreenPlayer() {
    this._playerFullScreenOn = !this._playerFullScreenOn;
    this.requestUpdate();
  }
}

customElements.define('media-explorer-card', MediaExplorerCard);
 // This is to have JSDoc works, just for development purposes

export { MediaExplorerCard };
