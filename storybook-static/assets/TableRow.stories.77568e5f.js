import{s,C as m}from"./styled-components.browser.esm.5ef351f6.js";import{O as f}from"./index.63e7eda2.js";import{r as y,a as g,j as t}from"./jsx-runtime.be8e9395.js";import{P as b}from"./index.21349b2c.js";import"./_commonjsHelpers.712cc82f.js";const w=s.div`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  gap: 8px;
  border-top: 1px solid var(--color-grey-01);
  &:first-child {
    border-top: none !important;
  }
`,v=s.span`
  white-space: nowrap;
  position: relative;

  /* when tooltip not null */
  ${({tooltip:e})=>e&&m`
      /* show tooltip on hover as ::after */
      &:hover::after {
        content: '${e}';
        display: block;
        position: absolute;
        top: -38px; /* adjust as needed */
        left: 0;
        padding: 8px;
        background-color: var(--color-grey-01);
        color: white;
        border-radius: 3px;
        z-index: 1;
        user-select: none;
        pointer-events: none;
        box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
      }
    `}
`,o=y.exports.forwardRef(({name:e,value:r,tooltip:d,onCopy:p,...c},u)=>g(w,{ref:u,...c,children:[t(v,{tooltip:d,children:e}),r?t(f,{value:r,onClick:p}):"-"]}));try{o.displayName="TableRow",o.__docgenInfo={description:"",displayName:"TableRow",props:{name:{defaultValue:null,description:"",name:"name",required:!1,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"ReactNode"}},tooltip:{defaultValue:null,description:"",name:"tooltip",required:!1,type:{name:"string"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"((value: string) => void)"}}}}}catch{}try{TableRow.displayName="TableRow",TableRow.__docgenInfo={description:"",displayName:"TableRow",props:{name:{defaultValue:null,description:"",name:"name",required:!1,type:{name:"string"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"ReactNode"}},tooltip:{defaultValue:null,description:"",name:"tooltip",required:!1,type:{name:"string"}},onCopy:{defaultValue:null,description:"",name:"onCopy",required:!1,type:{name:"((value: string) => void)"}}}}}catch{}const q={component:o,tags:["autodocs"]},a={render:()=>t(b,{style:{maxWidth:200},children:t(o,{name:"Description",value:"Some very long string that will be truncated"})})};var n,l,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <Panel style={{
    maxWidth: 200
  }}>
      <TableRow name="Description" value="Some very long string that will be truncated" />
    </Panel>
}`,...(i=(l=a.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};const V=["Default"];export{a as Default,V as __namedExportsOrder,q as default};
//# sourceMappingURL=TableRow.stories.77568e5f.js.map
