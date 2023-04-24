import{r as n,j as o,a as l}from"./jsx-runtime.be8e9395.js";import{s as p,C as a}from"./styled-components.browser.esm.5ef351f6.js";import"./_commonjsHelpers.712cc82f.js";const m=p.div`
  display: flex;
  align-items: center;
  margin: 20px 0;

  ${e=>!e.children&&a`
      border-bottom: 1px solid var(--color-grey-03);
    `}

  ${e=>e.children&&a`
      &::before,
      &::after {
        content: '';
        height: 1px;
        background-color: var(--color-grey-03);
      }

      &::before {
        margin-right: 2rem;
        flex-basis: 200px;
      }

      &::after {
        margin-left: 2rem;
        flex-grow: 1;
      }
    `}
`,t=n.exports.forwardRef(({...e},c)=>o(m,{...e,ref:c}));try{t.displayName="Divider",t.__docgenInfo={description:"",displayName:"Divider",props:{}}}catch{}try{Divider.displayName="Divider",Divider.__docgenInfo={description:"",displayName:"Divider",props:{}}}catch{}const y={component:t,tags:["autodocs"]},v=()=>l("div",{children:[o("h2",{children:"vvv Divider vvv"}),o(t,{style:{backgroundColor:"lightblue"}}),o("h2",{children:"^^^ Divider ^^^"})]}),r={render:v};var i,d,s;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: Template
}`,...(s=(d=r.parameters)==null?void 0:d.docs)==null?void 0:s.source}}};const h=["Default"];export{r as Default,h as __namedExportsOrder,y as default};
//# sourceMappingURL=Divider.stories.cdc145bc.js.map
