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

const folderIcon = "mdi:folder";
const fileIcon = "mdi:file";
const imageIcon = "mdi:image";
const videoIcon = "mdi:movie";
const backIcon = "mdi:arrow-left";
const zoomIcon = "mdi:fullscreen";
const nextIcon = "mdi:skip-next";
const prevIcon = "mdi:skip-previous";
const closeIcon = "mdi:close";
const dotsIcon = "mdi:dots-vertical";
const homeIcon = "mdi:home";
const refreshIcon = "mdi:refresh";
const clearIcon = "mdi:trash-can";

/** @param {import('./card.js').MediaExplorerCard} card */
const renderTemplate = (card) => x`
  <ha-card>
    <div id="mec-card">
      
      <div id="mec-header">
        <div id="mec-header-browser-buttons" ?hidden="${card.currentItemLink.isFile}">
          <button class="mec-button" ?disabled="${card.currentItemLink.isRoot}" @click="${() => card.navigationMap.navigateBack()}"><ha-icon icon=${backIcon}></button>
        </div>
        <div id="mec-header-player-buttons" ?hidden="${!card.currentItemLink.isFile}">
          <button class="mec-button" @click="${() => {
            card.navigationMap.navigateBack();
            card.fullScreenPlayerOn = false;
          }}"><ha-icon icon=${closeIcon}></button>
          <button class="mec-button" @click=${() => card.fullScreenPlayerOn = true}><ha-icon icon=${zoomIcon}></button>
          <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex <= card.currentItemLink.parent?.firstFileChildIndex}" @click=${() => card.navigationMap.openPrevSibling()}><ha-icon icon=${prevIcon}></button>
          <button class="mec-button" ?disabled="${card.currentItemLink.siblingIndex >= card.currentItemLink.parent?.lastFileChildIndex}" @click=${() => card.navigationMap.openNextSibling()}><ha-icon icon=${nextIcon}></button>
        </div>

        <div id="mec-header-title" ?hidden="${!card.config.title}"> ${card.config.title} </div>
        
        <div id="mec-header-info-area" ?hidden="${!card.config.showNavigationInfo}">
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isFile)}">${card.currentItemLink.title}</div>
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isDirectory && !card.currentItemLink.isRoot)}">${card.currentItemLink.mediaContentId.replace(card.config.startPath,".")}</div>
          <div class="mec-header-txt-info" ?hidden="${!(card.currentItemLink.isDirectory && card.currentItemLink.isRoot)}">./</div>
        </div>
        
        <div id="mec-header-right-area">
          <button id="mec-menu-button" ?hidden="${!card.config.showMenuButton}" class="mec-button" @click="${() => card.menuOn = true}"><ha-icon icon=${dotsIcon}></button>
        </div>
      </div>
      
      <div id="mec-content">       

        <div id="mec-browser-content" ?hidden="${card.currentItemLink.isFile}">
          ${card.currentItemLink.children.length > 0 ? getItemList(card) : card.navigationMap.loading ? x`<div class="loading">Loading...</div>` : x`<div class="p-4">No files found.</div>`}
        </div>

        <div id="mec-player-content" ?hidden="${!card.currentItemLink.isFile || card.fullScreenPlayerOn}">
          ${card.navigationMap.loading && !card.fullScreenPlayerOn ? x`<div class="loading">Loading...</div>` : getPlayer(card)}
        </div>

      </div>
    </div>
  </ha-card>
            
  ${card.menuOn
    ? x`
        <div class="mec-menu-overlay" @click=${() => card.menuOn = false}></div>
        <div class="mec-menu">
          <button class="mec-menu-item" @click=${() => {
            card.navigationMap.navigateBackToRoot();
            card.menuOn = false;
          }}><ha-icon icon=${homeIcon}></ha-icon> Back to root </button>
          <button class="mec-menu-item" @click=${() => {
            card.navigationMap.reloadCurrentItem();
            card.menuOn = false;
          }}><ha-icon icon=${refreshIcon}></ha-icon> Refresh </button>
          <button class="mec-menu-item" ?hidden="${!card.config.enableCache}" @click=${() => {
            card.navigationMap.clearCache();
            card.menuOn = false;
          }}><ha-icon icon=${clearIcon}></ha-icon> Clear cache </button>
        </div>
    ` : null}

  ${card.currentItemLink.isFile && card.fullScreenPlayerOn
    ? x`
        <div id="fullscreen-player">
          <div class="fullscreen-overlay">
            ${getPlayer(card)}
            <button class="fullscreen-close" @click="${() => card.fullScreenPlayerOn = false}"><ha-icon icon=${closeIcon}></button>
          </div>
        </div>
    ` : null}
`;

/** @param {import('./card.js').MediaExplorerCard} card */
const getItemList = (card) => {
  return x`
    ${card.currentItemLink.children.map((item,index) => x`
      <div class="mec-browser-content-item" @click="${() => {card.navigationMap.openChild(index);}}">
        <ha-icon class="mec-browser-content-item-icon" icon=${
          item?.isDirectory ? folderIcon 
            : item?.isImage ? imageIcon 
            : item?.isVideo ? videoIcon 
            : fileIcon
          }>
        </ha-icon>
        <div class="mec-browser-content-item-name">${item.title ?? "NA"}</div>
      </div>`
    )}

    ${card.navigationMap.loading && card.currentItemLink.children.length == 0 ? x`
      <div class="mec-browser-content-item">
        <div class="mec-browser-content-item-icon"><ha-icon icon=${fileIcon}></div>
        <div class="mec-browser-content-item-name">Loading...</div>
      </div>
      ` : ``}
  `
};

const getPlayer = (card) => {
  const item = card.currentItemLink;

  return x`
    ${item.isImage ? x`<img src="${item.url}" @error=${() => card.navigationMap.navigateBack()} alt="${item.title}" />`
      : item.isVideo ? x`<video src="${item.url}" @error=${() => card.navigationMap.navigateBack()} controls autoplay></video>`
      : item.isAudio ? x`<audio src="${item.url}" @error=${() => card.navigationMap.navigateBack()} controls autoplay></audio>`
      : x`<a href="${item.url}" target="_blank">File not supported</a>`}
  `;
};




  /*

*/

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
    padding: 0.5rem 0.5rem 0rem 0.5rem;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto;
    align-items: center; 
  }

  #mec-header-browser-buttons,
  #mec-header-player-buttons {
    display: flex;
    gap: 0.5rem;
    grid-column: 1;
    grid-row: 1;
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
    color: var(--secondary-text-color);
    border-radius: 50%;
    transition: background 0.2s;
  }
  .mec-button[disabled] {
    color: var(--state-inactive-color);
    border: 1px solid var(--state-inactive-color, #ccc);
    cursor: not-allowed;
    opacity: 0.6;
  }

  #mec-header-title {
    font-size: var(--paper-font-headline_-_font-size, 20px);
    color: var(--primary-text-color);
    grid-column: 2;
    grid-row: 1;
    text-align: center;
  }

  #mec-header-info-area {
    display: flex;
    gap: 0.5rem;
    grid-column: 1 / -1;
    grid-row: 2;
    margin: 5px 5px 0px 5px;
  }
  #mec-header-info-area[hidden] {
    display: none;
  }

  .mec-header-txt-info {
    color: var(--secondary-text-color);
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
  mec-header-txt-info[hidden] {
    display: none;
  }

  @media (max-width: 600px) {
    #mec-header {
      grid-template-rows: 1fr auto auto;
      grid-template-columns: 1fr 1fr;
    }
    #mec-header-title {
      grid-row: 1;
      grid-column: 1 / -1;
    }
    #mec-header-browser-buttons,
    #mec-header-player-buttons {
      grid-row: 2;
      grid-column: initial;
    }
    #mec-header-right-area {
      grid-row: 2;
      grid-column: end;
    }
    #mec-header-info-area {
      grid-row: 3;
      grid-column: 1 / -1;
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
    --mdc-icon-size: 100%;
    color: var(--state-icon-color);
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

  /* --- MENU --- */
  #mec-header-right-area {
    display: flex;
    gap: 0.5rem;
    grid-column: 3;
    grid-row: 1;
    justify-content: end;
  }
  #mec-menu-button {
    border: none;
  }
  #mec-menu-button[hidden] {
    display: none;
  }
  .mec-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  .mec-menu {
    position: absolute;
    top: 40px;
    right: 8px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 999;
    animation: mec-menu-fadein 0.15s ease-out;
  }

  .mec-menu-item {
    display: flex;
    width: 100%;
    padding: 8px 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--secondary-text-color);
    font: inherit;
    border-radius: 6px;
    align-items:center;
    gap: 6px;
  }
  .mec-menu-item[hidden]{
    display: none;
  }
  .mec-menu-item:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  @keyframes mec-menu-fadein {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

class NavigationItem {
  // Private fields
  #title = "";
  #mediaClass = "";
  #mediaContentId = "";
  #url = null;
  #lastUpdateDT = null;

  // Public fields
  /** @type {Array< NavigationItem >} */
  children = []; 
  /** @type {NavigationItem} */
  parent;
  hass;

  // Constructor
  constructor(hass,parent,title,mediaClass,mediaContentId,lastUpdateDT=null) {
    this.parent = parent;
    this.#title = title;
    this.#mediaClass = mediaClass;
    this.#mediaContentId = mediaContentId;
    this.hass = hass;
    this.#lastUpdateDT = lastUpdateDT;
  }

  // Static methods
  static fromJSON(hass, data, parent = null) {
    const newItem = new NavigationItem(hass,parent,data.title,data.mediaClass,data.mediaContentId,data.lastUpdateDT);
    if (Array.isArray(data.children)) 
      newItem.children.push(...data.children.map(childData => NavigationItem.fromJSON(hass,childData,newItem)));
    
    return newItem;
  }

  // Getters
  get title() {return this.#title}
  get mediaContentId() {return this.#mediaContentId}
  get url() {return this.#url}
  get mediaClass() {return this.#mediaClass}
  get isDirectory() {return this.#mediaClass === "directory"}
  get isFile() {return !this.isDirectory}
  get isVideo() {return this.#mediaClass === "video"}
  get isImage() {return this.#mediaClass === "image"}
  get isAudio() {return this.#mediaClass === "audio"}
  get isRoot() {return this.parent == null}
  get siblingIndex() {
    if (!this.parent) return 0;
    return this.parent.children.indexOf(this);
  }
  get firstFileChildIndex() {
    if (this.children.length == 0) return null;

    const returnVal = this.children.findIndex(item => item.isFile);
    if (returnVal == -1) return null;
    return returnVal;
  }
  get lastFileChildIndex() {
    if (this.children.length == 0) return null;

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i].isFile) return i;
    }
    return null;
  }
  get lastUpdateDT() {return this.#lastUpdateDT}

  // Instance methods
  toJSON() {
    return {
      title: this.#title,
      mediaClass: this.#mediaClass,
      mediaContentId: this.#mediaContentId,
      lastUpdateDT: this.#lastUpdateDT,
      children: this.children.map(child => child.toJSON()),
    }
  }

  async getURL() {
    /*  returnVal
    0 = nothing changed
    1 = something changed
    99 = error      
    */
    let returnVal = 0;
    try {
      const result = await this.hass.callWS({ 
        type: "media_source/resolve_media", 
        media_content_id: this.#mediaContentId
      });

      this.#url = result.url;
      returnVal = 1;

    } catch (err) {
      console.error("Failed to get url:", err);
      this.#url = null;
      returnVal = 99;
    }
    
    return returnVal;
  }

  async loadChildren() {
    /*  returnVal
    0 = nothing changed
    1 = something changed
    99 = error      
    */
    let returnVal = 0;
    try {
      const { children: updatedChildren = []} = await this.hass.callWS({ 
          type: "media_source/browse_media", 
          media_content_id: this.#mediaContentId 
      }) ?? {};  
      
      const currentChildrenMap = new Map(this.children.map(item => [item.mediaContentId, item]));
      const updatedChildrenContentIDs = updatedChildren.map(item => item.media_content_id);

      // Removed elements
      if (this.children.some(item => !updatedChildrenContentIDs.includes(item.mediaContentId))) returnVal = 1;

      // Rebuild children
      const newChildren = updatedChildren.map(item => {
        const existing = currentChildrenMap.get(item.media_content_id);
        if (!existing ||
            existing.title !== item.title ||
            existing.mediaClass !== item.media_class) {
              returnVal = 1;
              return new NavigationItem(this.hass,this,item.title,item.media_class,item.media_content_id);
            }
        return existing;       
      });

      const sameOrder = this.children.length === newChildren.length &&
                        this.children.every((child, idx) => child.mediaContentId === newChildren[idx].mediaContentId);
      if (!sameOrder) returnVal = 1;
      
      this.children = newChildren;
      this.#lastUpdateDT = Date.now();

    } catch (err) {
      console.error("Failed to load children:", err);
      returnVal = 99;
    }
    
    return returnVal;
  }

  clearURL () {
    this.#url = null;
    for (const child of this.children) child.clearURL();
  }
}

class NavigationMap extends EventTarget {
  // Private fields
  /** @type {import('./utils.js').CacheManager} */
  #cacheManager;
  #cacheKey = "";
  #initDone = false;
  #startPath = "";

  // Public fields
  /** @type {NavigationItem} */
  rootItem;
  /** @type {NavigationItem} */
  currentItem;
  hass;
  loading=false;

  // Constructor
  constructor(hass, cacheManager, cacheKey, startPath) { 
    super();
    
    this.hass = hass;
    this.#cacheManager = cacheManager;
    this.#cacheKey = cacheKey;
    this.#startPath = startPath;

    this.#Init();
  }

  // Getters
  get initDone() {return this.#initDone}

  // Instance methods
  navigateBackToRoot() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.currentItem = this.rootItem;
      this.#openCurrentItem(); 
    }
  }
  navigateBack() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.currentItem = this.currentItem.parent;
      this.#openCurrentItem(); 
    }
  }
  reloadCurrentItem() {
    if (!this.#initDone) return null;
    if (!this.loading) {
      this.#openCurrentItem(); 
    }
  }
  openChild(index) {
    if (!this.#initDone) return null;
    if (!this.loading) {
      if (index >= 0 && index < this.currentItem.children.length) {
        this.currentItem = this.currentItem.children[index];      
        this.#openCurrentItem(); 
      }
    }
  }
  openNextSibling() {
    if (!this.#initDone || this.loading || !this.currentItem?.parent) return null;

    const siblings = this.currentItem.parent.children;
    if (!siblings?.length) return;

    const currentIndex = this.currentItem.siblingIndex;
    let sibling = null;    
    for (let i = currentIndex + 1; i < siblings.length; i ++){
      if (siblings[i].isFile){
        sibling = siblings[i];
        break;
      }
    }

    if (!sibling) sibling = siblings.find(item => item.isFile);

    if (sibling && sibling !== this.currentItem) {
      this.currentItem = sibling;    
      this.#openCurrentItem(); 
    }
    
  }
  openPrevSibling() {
    if (!this.#initDone || this.loading || !this.currentItem?.parent) return;

    const siblings = this.currentItem.parent.children;
    if (!siblings?.length) return;

    const currentIndex = this.currentItem.siblingIndex;
    let sibling = null;
    for (let i = currentIndex - 1; i >= 0; i--){
      if (siblings[i].isFile){
        sibling = siblings[i];
        break;
      }
    }

    if (!sibling){
      for (let i = siblings.length - 1; i >= 0; i--) {
        if (siblings[i].isFile) {
          sibling = siblings[i];
          break;
        }
      }
    }

    if (sibling && sibling !== this.currentItem) {
      this.currentItem = sibling;    
      this.#openCurrentItem(); 
    }
    
  }
  clearCache() {
    if (!this.#initDone || !this.#cacheManager) return null;
    this.#cacheManager.clearCache(this.#cacheKey);
    this.currentItem = this.rootItem;
    this.rootItem.children = [];
    this.#openCurrentItem();
  }

  // Private methods
  async #Init() {

    let cachedData = null;
    if (this.#cacheManager) cachedData = await this.#cacheManager.getCachedData(this.#cacheKey);

    if (!cachedData) this.rootItem = new NavigationItem(this.hass,null,"root","directory",this.#startPath);
    else this.rootItem = NavigationItem.fromJSON(this.hass,cachedData);

    this.rootItem.clearURL();

    this.currentItem = this.rootItem;
    this.#openCurrentItem(); 
    this.#initDone = true;
  }
  #openCurrentItem() {
    if (this.currentItem.isDirectory) {
      this.#sendEventCurrentItemChanged();
      this.#loadCurrentItemChildren();  
    }    
    else {
      this.currentItem.getURL().then((returnVal) => {
        if (returnVal == 1) this.#sendEventCurrentItemChanged();
        if (returnVal == 99) this.navigateBack();
      });
    }
  }
  #saveMapOnCache() {
    if (!this.#cacheManager) return;
    this.#cacheManager.saveOnCache(this.#cacheKey, this.rootItem.toJSON());
  }
  #loadCurrentItemChildren() {
    this.loading = true;
    this.currentItem.loadChildren().then(returnVal => {
      this.loading = false;
      if(returnVal == 1) {
        this.#sendEventCurrentItemChanged();
        this.#saveMapOnCache();
      }
      else if(returnVal == 99) {
        this.navigateBack();
      }
    });
  }
  #sendEventCurrentItemChanged(){
    this.dispatchEvent(new CustomEvent("currentItemChanged", {
        detail: this.currentItem
    }));
  }
  #findOldestDirectory(thisDirectory, oldestDirectory) {
    if (oldestDirectory == null || thisDirectory.lastUpdateDT < oldestDirectory.lastUpdateDT) oldestDirectory = thisDirectory;

    for(const child of thisDirectory.children) {
      if (child.isDirectory) oldestDirectory = this.#findOldestDirectory(child,oldestDirectory);
    }

    return oldestDirectory;
  }
}

const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const transactionDoneMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    // This mapping exists in reverseTransformCache but doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(this.request);
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];
const methodMap = {};
const advanceResults = new WeakMap();
const ittrProxiedCursorToOriginalProxy = new WeakMap();
const cursorIteratorTraps = {
    get(target, prop) {
        if (!advanceMethodProps.includes(prop))
            return target[prop];
        let cachedFunc = methodMap[prop];
        if (!cachedFunc) {
            cachedFunc = methodMap[prop] = function (...args) {
                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
            };
        }
        return cachedFunc;
    },
};
async function* iterate(...args) {
    // tslint:disable-next-line:no-this-assignment
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
        cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
        return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    // Map this double-proxy back to the original, so other cursor methods work.
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
        yield proxiedCursor;
        // If one of the advancing methods was not called, call continue().
        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
        advanceResults.delete(proxiedCursor);
    }
}
function isIteratorProp(target, prop) {
    return ((prop === Symbol.asyncIterator &&
        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||
        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
        if (isIteratorProp(target, prop))
            return iterate;
        return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
        return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    },
}));

class CacheManager {
  #dbName;
  #dbVersion;
  #tableName;

  constructor(dbName,dbVersion,tableName){
    this.#dbName = dbName;
    this.#dbVersion = dbVersion;
    this.#tableName = tableName;
    
    this.#getDB(this.#tableName);
  }

  async saveOnCache(dataKey,data) {
    try {
      const db = await this.#getDB(this.#tableName);
      await db.put(this.#tableName, data, dataKey);
    } catch (err) {
      console.error("Error saving to IndexedDB:", err);
    }
  }
  async getCachedData(dataKey) {
    try {
      const db = await this.#getDB(this.#tableName);
      const data = await db.get(this.#tableName, dataKey);
      if (!data) return null;
      return data;
    } catch (err) {
      console.warn("Error reading cache:", err);
      await this.clearCache(dataKey);
      return null;
    }
  }
  async clearCache(dataKey) {
    try {
      const db = await this.#getDB(this.#tableName);
      await db.delete(this.#tableName, dataKey);
    } catch (err) {
      console.error("Error clearing cache:", err);
    }
  }
  
  // Private methods
  async #getDB(tableName) {
    return await openDB(this.#dbName, this.#dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(tableName)) db.createObjectStore(tableName);
      }
    });
  }
}

class MediaExplorerCard extends i {
  
  // private fields
  #version = "20251107a";
  cacheManager;
  #cacheDBName = "MediaExplorerCard";
  #cacheDBVersion = 1;
  #cacheTableName = "";
  #cacheMapKey = "map";
  #cacheVersionKey = "cardVersion";
  #initDone = false;

  // public fields
  /** @type {NavigationMap} */
  navigationMap;
  /** @type {NavigationItem} */
  currentItemLink = null;
  config;

  static properties = {
    hass: {},
    config: {},
    currentItemLink: { state: true, hasChanged: () => true },
    fullScreenPlayerOn: { type: Boolean},
    menuOn: { type: Boolean},
  };

  static styles = cardStyle;

  constructor() {
    super();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.navigationMap && this.config) this.#initCard();
  }

  get hass() {return this._hass}

  setConfig(config) { 
    if (!config) throw new Error("No configuration provided");
    if (!config.startPath) throw new TypeError("Missing startPath");

    this.config = {
      showMenuButton: true,
      showNavigationInfo: true,
      enableCache: true,
      ...config,
    };

    if (this._hass) this.#initCard();
  }

  async #initCard(){
    this.#cacheTableName = "mec_" + this.config.startPath.replace(/\s+/g, "_");
    this.cacheManager = new CacheManager(this.#cacheDBName,this.#cacheDBVersion,this.#cacheTableName);

    let cachedVersion = await this.cacheManager.getCachedData(this.#cacheVersionKey);

    if (!cachedVersion || cachedVersion !== this.#version){
      await this.cacheManager.clearCache(this.#cacheVersionKey);
      await this.cacheManager.clearCache(this.#cacheMapKey);
      await this.cacheManager.saveOnCache(this.#cacheVersionKey,this.#version);
    }

    if (!this.config.enableCache){
      await this.cacheManager.clearCache(this.#cacheMapKey);
      this.navigationMap = new NavigationMap(this._hass,null,null,this.config.startPath);
    }
    else this.navigationMap = new NavigationMap(this._hass,this.cacheManager,this.#cacheMapKey,this.config.startPath);

    this.navigationMap.addEventListener("currentItemChanged", (e) => {
      this.currentItemLink = e.detail;
      this.requestUpdate();
    });
    this.currentItemLink = this.navigationMap.currentItem;
    this.#initDone = true;
  }

  getCardSize() { return 3; }

  firstUpdated() {
  }

  render() { 
    if (!this.#initDone || !this.navigationMap.initDone) return null;
    return renderTemplate(this); 
  }
}

customElements.define('media-explorer-card', MediaExplorerCard);
 // This is to have JSDoc works, just for development purposes

export { MediaExplorerCard };
