import{s as y}from"./styled-components.browser.esm.5ef351f6.js";import{r as v,a as g,j as l}from"./jsx-runtime.be8e9395.js";import{B as R}from"./index.11db2722.js";import{I as L}from"./index.2a750c04.js";import{I as ge}from"./index.1a493964.js";import{D as fe}from"./index.bc2f837d.js";import"./_commonjsHelpers.712cc82f.js";import"./index.b8ae8ae1.js";import"./styles.38d859eb.js";const X=e=>Math.max(Math.min(Math.round(parseInt(e,16)/255*100)/100,1),0),$=e=>Math.min(Math.max(e,0),255).toString(16),N=e=>Math.max(Math.min(Math.round(e*255),255),0),ve=(e=[],o)=>{if(!["float","uint8","uint16"].includes(o))return console.error(`Format: ${o} is not supported`);let a=[];return o==="float"?a=e.map(u=>u*255):o==="uint16"?a=e.map(u=>u/65535*255):a=e,a=a.map(u=>Math.max(Math.min(Math.round(u),255),0)),"#"+(1<<24|a[0]<<16|a[1]<<8|a[2]).toString(16).slice(1)},xe=(e,o)=>(/^#([0-9a-f]{3}){1,2}$/i.test(e)||(e=o),e),ye=e=>Math.max(Math.min(Math.round(e*65535),65535),0),Ce=y.div`
  position: relative;
  display: grid;
  margin-right: 5px;
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  max-width: var(--base-input-size);
  min-width: var(--base-input-size);

  & > * {
    grid-row: 1;
    grid-column: 1;

    border-radius: var(--base-input-border-radius);
  }
`,be=y.input`
  /* if disabled remove click events */
  pointer-events: ${e=>e.disabled&&"none"};
  cursor: pointer;

  width: 100%;
  height: 100%;

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }
`,Ie=y.span`
  width: 100%;
  height: 100%;
  pointer-events: none;

  /* DOES NOT SUPPORT IE or pre-Chromium Edge */
  background: repeating-conic-gradient(#808080 0% 25%, rgb(51 51 51) 0% 50%) 50% / 15px 15px;
`,Ee=y.button`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  cursor: pointer;
  margin: 0;

  /* if disabled remove click events */
  pointer-events: ${e=>e.disabled&&"none"};

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }
`,q=v.exports.forwardRef(({onClick:e,onChange:o,backgroundColor:s,value:a,onBlur:I},u)=>g(Ce,{ref:u,children:[l(be,{type:"color",disabled:!o,tabIndex:o?0:-1,onChange:o&&o,value:a,onBlur:I}),l(Ie,{}),l(Ee,{style:{backgroundColor:s,pointerEvents:e?"auto":"none"},disabled:!e,tabIndex:e?0:-1,onClick:e})]}));try{q.displayName="ColorPickerPreview",q.__docgenInfo={description:"",displayName:"ColorPickerPreview",props:{onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((e: ChangeEvent<HTMLInputElement>) => void)"}},backgroundColor:{defaultValue:null,description:"",name:"backgroundColor",required:!1,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!1,type:{name:"((e: FocusEvent<HTMLInputElement, Element>) => void)"}}}}}catch{}const Me=y.div`
  display: flex;
  align-items: center;

  input[type='number'],
  input[type='text'] {
    margin: 5px;
  }

  input[type='number'] {
    width: 70px;
    margin: 5px;
  }
`,Se=y.div`
  display: flex;
  justify-content: center;
  gap: var(--base-gap-large);
  margin-top: 12px;
`,M={hex:{placeholder:"#34C95C"},float:{placeholder:.5,step:.01,max:1},uint8:{placeholder:255,step:1,max:255},uint16:{placeholder:65535,step:1,max:65535}},B=v.exports.forwardRef(({value:e,onChange:o,alpha:s,format:a="hex",className:I,style:u},ue)=>{const f=a==="hex";let n,d=1;const ce=v.exports.useRef(null);f?(n=e,typeof n!="string"&&(n="#FFFFFF"),d=s?X(n.slice(7,9)):1,e.length<8&&(d=1),n=n.slice(0,7)):(n=[...e],Array.isArray(e)||(n=[0,0,0]),s&&(n[3]||n[3]==0?d=n[3]:d=1),n=n.slice(0,3));const[c,p]=v.exports.useState(n),[x,C]=v.exports.useState(d),[pe,D]=v.exports.useState(!1);v.exports.useEffect(()=>{C(d),p(n)},[e,C,p]);const O=["r","g","b"],P=r=>{r.preventDefault();const{id:m,value:t}=r.target;let i;f?i=t:(i=[...c],i.splice(O.indexOf(m),1,parseFloat(t))),p(i)},T=r=>{var i;r.preventDefault();const m=(i=r.target)==null?void 0:i.value;if(f)return p(m);let t=[];if(m){const h=m.slice(1,7).match(/.{1,2}/g);h&&(t=h.map(he=>X(he)))}if(a==="float")return p(t);if(a==="uint8")return p(t.map(h=>N(h)));if(a==="uint16")return p(t.map(h=>ye(h)))},de=()=>{D(!0)},b=()=>{D(!1);let r;if(f?(r=c,r=xe(r,n)):Array.isArray(c)&&(r=[...c],r=r.map((t,i)=>isNaN(t)?n[i]:parseFloat(t.toString()))),console.log(c),p(r),s){let t=x&&isNaN(x)?d:x;t=Math.min(Math.max(t||1,0),1),C(t),f?r=r+(t>0?$(N(t)):"00"):r=[...r,t]}o({target:{value:r}})},U=()=>{console.log("cancelling"),p(n),C(d),D(!1)},me=`Colour Picker (${a.charAt(0).toUpperCase()+a.slice(1)})`,E=f?c:ve(c,a);let V=E;s&&(V=E+(x||0>0?$(N(x)):"00"));const H=s||["uint16","float"].includes(a);return g("div",{ref:ue,className:I,style:u,children:[l(q,{onClick:H?de:void 0,backgroundColor:V,value:E,onChange:H?void 0:T,onBlur:()=>!H&&b(),ref:ce}),g(fe,{header:me,onHide:U,visible:pe,children:[g(Me,{children:[l(q,{onChange:T,backgroundColor:V,value:E}),f?g("div",{children:[l("label",{htmlFor:"hex",children:"HEX"}),l(ge,{id:"hex",value:c,onChange:P,name:"hex",maxLength:7,placeholder:M.hex.placeholder,required:!0,onKeyDown:r=>r.key==="Enter"&&b()})]}):O.map((r,m)=>{var i;const t=c[m];return g("div",{children:[l("label",{htmlFor:r,children:r.toUpperCase()}),l(L,{id:r,min:0,max:M[a].max,value:t,step:M[a].step,onChange:P,placeholder:(i=M[a].placeholder)==null?void 0:i.toString(),required:!0,onKeyDown:h=>h.key==="Enter"&&b()})]},r)}),s&&g("div",{children:[l("label",{htmlFor:"a",children:"A"}),l(L,{id:"a",min:0,max:1,value:x,step:.01,onChange:r=>C(parseFloat(r.target.value)),placeholder:"0.5",required:!0,onKeyDown:r=>r.key==="Enter"&&b()})]},"a")]}),g(Se,{children:[l(R,{label:"Cancel",onClick:U}),l(R,{label:"Apply",onClick:b})]})]})]})});try{B.displayName="InputColor",B.__docgenInfo={description:"",displayName:"InputColor",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string | number[]"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(event: { target: { value: string | number[]; }; }) => void"}},alpha:{defaultValue:null,description:"",name:"alpha",required:!1,type:{name:"boolean"}},format:{defaultValue:{value:"hex"},description:"",name:"format",required:!1,type:{name:"enum",value:[{value:'"hex"'},{value:'"float"'},{value:'"uint8"'},{value:'"uint16"'}]}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}}}}}catch{}const Ne={component:B,tags:["autodocs"]},S={args:{value:"#14d25d",format:"hex"}},_={args:{value:"#14d25dBB",alpha:!0,format:"hex"}},k={args:{value:[255,145,56],format:"uint8"}},w={args:{value:[255,145,56,.8],alpha:!0,format:"uint8"}},F={args:{value:[.5,.3,.9],format:"float"}},A={args:{value:[65535,24580,14456],format:"uint16"}};var j,z,K;S.parameters={...S.parameters,docs:{...(j=S.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    value: '#14d25d',
    format: 'hex'
  }
}`,...(K=(z=S.parameters)==null?void 0:z.docs)==null?void 0:K.source}}};var G,W,J;_.parameters={..._.parameters,docs:{...(G=_.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    value: '#14d25dBB',
    alpha: true,
    format: 'hex'
  }
}`,...(J=(W=_.parameters)==null?void 0:W.docs)==null?void 0:J.source}}};var Q,Y,Z;k.parameters={...k.parameters,docs:{...(Q=k.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    value: [255, 145, 56],
    format: 'uint8'
  }
}`,...(Z=(Y=k.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,re,ae;w.parameters={...w.parameters,docs:{...(ee=w.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    value: [255, 145, 56, 0.8],
    alpha: true,
    format: 'uint8'
  }
}`,...(ae=(re=w.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var te,ne,oe;F.parameters={...F.parameters,docs:{...(te=F.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    value: [0.5, 0.3, 0.9],
    format: 'float'
  }
}`,...(oe=(ne=F.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};var le,ie,se;A.parameters={...A.parameters,docs:{...(le=A.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    value: [65535, 24580, 14456],
    format: 'uint16'
  }
}`,...(se=(ie=A.parameters)==null?void 0:ie.docs)==null?void 0:se.source}}};const Be=["HEX","HEXA","Uint8","Uint8A","Float","Uint16"];export{F as Float,S as HEX,_ as HEXA,A as Uint16,k as Uint8,w as Uint8A,Be as __namedExportsOrder,Ne as default};
//# sourceMappingURL=InputColor.stories.f3bef175.js.map
