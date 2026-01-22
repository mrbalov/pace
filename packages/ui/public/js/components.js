(()=>{class q extends HTMLElement{render=()=>{let f=this.getAttribute("variant")||"primary",j=this.hasAttribute("disabled"),k=this.hasAttribute("loading"),F=this.textContent||"",G=this.getAttribute("type")||"button",I=f==="secondary"?"pico-btn pico-btn-secondary":f==="outline"?"pico-btn pico-btn-outline":"pico-btn",J=k?'<span aria-hidden="true">⏳ </span>':"";this.innerHTML=`
      <button 
        class="${I}"
        type="${G}"
        ${j?"disabled":""}
        ${k?'aria-busy="true"':""}
      >
        ${J}${F}
      </button>
    `};connectedCallback=()=>{this.render()};static get observedAttributes(){return["variant","disabled","loading","type"]}attributeChangedCallback=()=>{this.render()}}customElements.define("app-button",q);var K=(f)=>{if(f.nodeType===Node.ELEMENT_NODE){let j=f;return j.getAttribute("slot")!=="header"&&j.getAttribute("slot")!=="footer"}return f.nodeType===Node.TEXT_NODE||f.nodeType===Node.ELEMENT_NODE},P=(f)=>{if(f.nodeType===Node.ELEMENT_NODE)return f.outerHTML;return f.textContent||""};class x extends HTMLElement{render=()=>{let f=this.querySelector('[slot="header"]')?.outerHTML||"",j=this.querySelector('[slot="footer"]')?.outerHTML||"",k=Array.from(this.childNodes).filter(K).map(P).join("");this.innerHTML=`
      <article class="pico-card">
        ${f?`<header>${f.replace(/slot="header"/g,"")}</header>`:""}
        ${k?`<div>${k}</div>`:""}
        ${j?`<footer>${j.replace(/slot="footer"/g,"")}</footer>`:""}
      </article>
    `};connectedCallback=()=>{this.render()}}customElements.define("app-card",x);class E extends HTMLElement{render=()=>{let f=this.getAttribute("size")||"medium",j=this.getAttribute("text")||"Loading...",k=f==="small"?"small":f==="large"?"large":"";this.innerHTML=`
      <div role="status" aria-live="polite" class="loading-spinner ${k}">
        <span aria-hidden="true" class="spinner">⏳</span>
        <span class="sr-only">${j}</span>
      </div>
      <style>
        .loading-spinner {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .loading-spinner .spinner {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        .loading-spinner.small .spinner {
          font-size: 0.875rem;
        }
        .loading-spinner.large .spinner {
          font-size: 1.5rem;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `};connectedCallback=()=>{this.render()};static get observedAttributes(){return["size","text"]}attributeChangedCallback=()=>{this.render()}}customElements.define("loading-spinner",E);})();
