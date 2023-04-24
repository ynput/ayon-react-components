import{D as w}from"./index.62925133.js";import{r as c,j as n,a as v,F as h}from"./jsx-runtime.be8e9395.js";import{s as N,C as _}from"./styled-components.browser.esm.5ef351f6.js";import{U as M}from"./index.623c7dbf.js";import{U as S}from"./index.ecc29691.js";import"./_commonjsHelpers.712cc82f.js";import"./index.1a493964.js";import"./styles.38d859eb.js";import"./index.b8ae8ae1.js";const f=c.exports.forwardRef(({value:e=[],options:a=[],onChange:l,widthExpand:r,disabled:s,editor:d,align:o,...t},y)=>{const u=c.exports.useMemo(()=>a.filter(i=>e.includes(i.name)),[e,a]);return d?n(w,{value:e,valueTemplate:()=>n(g,{value:u,...t}),options:a,dataKey:"name",disabled:s,itemTemplate:(i,p,A)=>n(V,{...i,isSelected:A}),onChange:i=>l&&l(i.map(p=>p.toString())),widthExpand:r,align:o,multiSelect:!0,search:!0,searchFields:["name","fullName"],ref:y}):n(g,{value:u,...t})});try{f.displayName="AssigneeSelect",f.__docgenInfo={description:"",displayName:"AssigneeSelect",props:{value:{defaultValue:{value:"[]"},description:"",name:"value",required:!1,type:{name:"string[]"}},options:{defaultValue:{value:"[]"},description:"",name:"options",required:!1,type:{name:"{ name: string; fullName?: string; avatarUrl?: string; }[]"}},editor:{defaultValue:null,description:"",name:"editor",required:!1,type:{name:"boolean"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((names: string[]) => void)"}},widthExpand:{defaultValue:null,description:"",name:"widthExpand",required:!1,type:{name:"boolean"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},align:{defaultValue:null,description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}},isMultiple:{defaultValue:null,description:"",name:"isMultiple",required:!1,type:{name:"boolean"}}}}}catch{}const U=N.div`
  position: relative;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  height: 30px;
  gap: 4px;

  span {
    position: relative;
    top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${({disabled:e})=>e&&_`
      color: var(--color-text-dim);
      span {
        color: var(--color-text-dim);
      }
      img {
        opacity: 0.75;
      }
      background-color: var(--input-disabled-background-color);
    `}

  ${({isMultiple:e})=>e&&_`
      ::before {
        content: 'Multiple (';
        margin-right: 4px;
      }

      ::after {
        content: ')';
        margin-left: 4px;
      }
    `}
`,g=c.exports.forwardRef(({value:e=[],onClick:a,disabled:l,isMultiple:r,placeholder:s,emptyIcon:d=!0,emptyMessage:o="",size:t=21,...y},u)=>{var i;return n(U,{onClick:l?void 0:p=>a&&a(p),disabled:l,isMultiple:r&&(!l||!s),...y,ref:u,children:l&&s?n("span",{children:s}):e.length?v(h,{children:[n(M,{users:e,size:t,gap:-.3,userStyle:{minWidth:t,minHeight:t,maxHeight:t,maxWidth:t}}),e.length<2&&n("span",{children:(i=e[0])==null?void 0:i.fullName})]}):v(h,{children:[d&&!r&&n("span",{className:"material-symbols-outlined",children:"add_circle"}),o&&n("span",{children:o})]})})});try{g.displayName="AssigneeField",g.__docgenInfo={description:"",displayName:"AssigneeField",props:{value:{defaultValue:{value:"[]"},description:"",name:"value",required:!1,type:{name:"{ name: string; fullName?: string; avatarUrl?: string; }[]"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((e: MouseEvent<HTMLDivElement, MouseEvent>) => void)"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},isMultiple:{defaultValue:null,description:"",name:"isMultiple",required:!1,type:{name:"boolean"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string"}},emptyMessage:{defaultValue:{value:""},description:"",name:"emptyMessage",required:!1,type:{name:"string"}},emptyIcon:{defaultValue:{value:"true"},description:"",name:"emptyIcon",required:!1,type:{name:"boolean"}},size:{defaultValue:{value:"21"},description:"",name:"size",required:!1,type:{name:"number"}}}}}catch{}const C=N.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;

  ${({isSelected:e})=>e&&_`
      background-color: var(--color-row-hl);
    `}
`,V=({name:e,avatarUrl:a,fullName:l,isSelected:r,onClick:s,size:d=21})=>v(C,{isSelected:r,onClick:s,children:[n(S,{src:a,fullName:l||e,size:d}),l||e]});try{V.displayName="AssigneeDropdownTemplate",V.__docgenInfo={description:"",displayName:"AssigneeDropdownTemplate",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},fullName:{defaultValue:null,description:"",name:"fullName",required:!1,type:{name:"string"}},avatarUrl:{defaultValue:null,description:"",name:"avatarUrl",required:!1,type:{name:"string"}},isSelected:{defaultValue:null,description:"",name:"isSelected",required:!1,type:{name:"boolean"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},size:{defaultValue:{value:"21"},description:"",name:"size",required:!1,type:{name:"number"}}}}}catch{}try{AssigneeSelect.displayName="AssigneeSelect",AssigneeSelect.__docgenInfo={description:"",displayName:"AssigneeSelect",props:{value:{defaultValue:{value:"[]"},description:"",name:"value",required:!1,type:{name:"string[]"}},options:{defaultValue:{value:"[]"},description:"",name:"options",required:!1,type:{name:"{ name: string; fullName?: string; avatarUrl?: string; }[]"}},editor:{defaultValue:null,description:"",name:"editor",required:!1,type:{name:"boolean"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((names: string[]) => void)"}},widthExpand:{defaultValue:null,description:"",name:"widthExpand",required:!1,type:{name:"boolean"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},align:{defaultValue:null,description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}},isMultiple:{defaultValue:null,description:"",name:"isMultiple",required:!1,type:{name:"boolean"}}}}}catch{}try{AssigneeField.displayName="AssigneeField",AssigneeField.__docgenInfo={description:"",displayName:"AssigneeField",props:{value:{defaultValue:{value:"[]"},description:"",name:"value",required:!1,type:{name:"{ name: string; fullName?: string; avatarUrl?: string; }[]"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((e: MouseEvent<HTMLDivElement, MouseEvent>) => void)"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},isMultiple:{defaultValue:null,description:"",name:"isMultiple",required:!1,type:{name:"boolean"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string"}},emptyMessage:{defaultValue:{value:""},description:"",name:"emptyMessage",required:!1,type:{name:"string"}},emptyIcon:{defaultValue:{value:"true"},description:"",name:"emptyIcon",required:!1,type:{name:"boolean"}},size:{defaultValue:{value:"21"},description:"",name:"size",required:!1,type:{name:"number"}}}}}catch{}try{AssigneeDropdownTemplate.displayName="AssigneeDropdownTemplate",AssigneeDropdownTemplate.__docgenInfo={description:"",displayName:"AssigneeDropdownTemplate",props:{name:{defaultValue:null,description:"",name:"name",required:!0,type:{name:"string"}},fullName:{defaultValue:null,description:"",name:"fullName",required:!1,type:{name:"string"}},avatarUrl:{defaultValue:null,description:"",name:"avatarUrl",required:!1,type:{name:"string"}},isSelected:{defaultValue:null,description:"",name:"isSelected",required:!1,type:{name:"boolean"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},size:{defaultValue:{value:"21"},description:"",name:"size",required:!1,type:{name:"number"}}}}}catch{}const W={component:f,tags:["autodocs"]},D=Array.from({length:100},(e,a)=>({name:`user${a+1}`,fullName:`User ${a+1}`,avatarUrl:`https://repo.imm.cz/avatars/demouser${a+10}.jpg`})),T=Array.from({length:3},(e,a)=>({name:`user${a+1}`,fullName:`User ${a+1}`,avatarUrl:`https://repo.imm.cz/avatars/demouser${a+10}.jpg`})),k=()=>{const e=T.map(r=>r.name),[a,l]=c.exports.useState(e);return n(f,{options:D,value:a,onChange:r=>l(r),editor:!0})},m={render:k};var q,b,x;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: Template
}`,...(x=(b=m.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const K=["Default"];export{m as Default,K as __namedExportsOrder,W as default};
//# sourceMappingURL=AssigneeSelect.stories.01e9bb35.js.map
