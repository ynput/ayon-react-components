import{r as l,j as t,a as b}from"./jsx-runtime.be8e9395.js";import{s as o,C as _}from"./styled-components.browser.esm.5ef351f6.js";import{B as D}from"./index.11db2722.js";const q=o.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 500;
  cursor: pointer;
`,v=o.div`
  background-color: var(--color-grey-01);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-width: 200px;
  min-height: 100px;
  max-width: 85%;
  max-height: 85%;
  position: relative;
  cursor: auto;
  :focus {
    outline: none;
  }

  /* add padding to top if no header */

  ${({noHeader:e})=>e&&_`
      padding-top: 46px;
    `}
`,u=o.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`,V=o(u)`
  font-weight: bold;
  border-bottom: 1px solid var(--color-surface-04);
  padding: 16px 0;
`,C=o(u)`
  border-top: 1px solid var(--color-surface-04);
  padding: 16px 0;
`,N=o.div`
  display: flex;
  flex-direction: column;

  flex-grow: 1;
`,w=o(D)`
  position: absolute;
  top: 8px;
  right: 8px;
`,s=l.exports.forwardRef(({onHide:e,header:a,footer:i,children:p,headerStyle:c,bodyStyle:f,footerStyle:m,visible:y,...g},x)=>{const n=l.exports.useMemo(()=>a?t(V,{style:c,children:a}):null,[a]),S=l.exports.useMemo(()=>i?t(C,{style:m,children:i}):null,[a]),h=r=>{r.currentTarget==r.target&&(!e||(r.preventDefault(),e()))},d=r=>{r.key==="Escape"&&e&&e()};return y?t(q,{className:"dialog-shade",onClick:h,onKeyDown:d,ref:x,children:b(v,{...g,onKeyDown:d,tabIndex:-1,noHeader:!n,children:[t(w,{icon:"close",autoFocus:!0,onClick:e}),n,t(N,{style:f,children:p}),S]})}):null});try{s.displayName="Dialog",s.__docgenInfo={description:"",displayName:"Dialog",props:{onHide:{defaultValue:null,description:"",name:"onHide",required:!1,type:{name:"(() => void)"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"",name:"footer",required:!1,type:{name:"ReactNode"}},headerStyle:{defaultValue:null,description:"",name:"headerStyle",required:!1,type:{name:"CSSProperties"}},bodyStyle:{defaultValue:null,description:"",name:"bodyStyle",required:!1,type:{name:"CSSProperties"}},footerStyle:{defaultValue:null,description:"",name:"footerStyle",required:!1,type:{name:"CSSProperties"}},visible:{defaultValue:null,description:"",name:"visible",required:!1,type:{name:"boolean"}}}}}catch{}try{Dialog.displayName="Dialog",Dialog.__docgenInfo={description:"",displayName:"Dialog",props:{onHide:{defaultValue:null,description:"",name:"onHide",required:!1,type:{name:"(() => void)"}},header:{defaultValue:null,description:"",name:"header",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"",name:"footer",required:!1,type:{name:"ReactNode"}},headerStyle:{defaultValue:null,description:"",name:"headerStyle",required:!1,type:{name:"CSSProperties"}},bodyStyle:{defaultValue:null,description:"",name:"bodyStyle",required:!1,type:{name:"CSSProperties"}},footerStyle:{defaultValue:null,description:"",name:"footerStyle",required:!1,type:{name:"CSSProperties"}},visible:{defaultValue:null,description:"",name:"visible",required:!1,type:{name:"boolean"}}}}}catch{}export{s as D};
//# sourceMappingURL=index.bc2f837d.js.map
