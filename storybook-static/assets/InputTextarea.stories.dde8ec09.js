import{r as l,j as d}from"./jsx-runtime.be8e9395.js";import{s as c}from"./styled-components.browser.esm.5ef351f6.js";import"./_commonjsHelpers.712cc82f.js";const p=c.textarea`
  color: var(--color-text);
  border: 1px solid var(--color-grey-03);
  background-color: var(--color-grey-00);
  border-radius: var(--base-input-border-radius);
  min-height: var(--base-input-size);
  padding: 6px 5px;
  resize: vertical;

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &.error,
  &:invalid {
    border-color: var(--color-hl-error);
  }

  &:disabled {
    color: var(--color-text-dim);
    background-color: var(--input-disabled-background-color);
    border-color: var(--input-disabled-border-color);
    font-style: italic;
    cursor: not-allowed;
  }
`,e=l.exports.forwardRef((a,n)=>d(p,{type:"text",ref:n,...a}));e.displayName="InputTextarea";try{e.displayName="InputTextarea",e.__docgenInfo={description:"",displayName:"InputTextarea",props:{}}}catch{}try{InputTextarea.displayName="InputTextarea",InputTextarea.__docgenInfo={description:"",displayName:"InputTextarea",props:{}}}catch{}const x={component:e,tags:["autodocs"]},r={args:{value:"For longer input, use textarea.",placeholder:"Start typing here...",disabled:!1,onChange:()=>console.log("Text Changed")}};var o,t,s;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    value: 'For longer input, use textarea.',
    placeholder: 'Start typing here...',
    disabled: false,
    onChange: () => console.log('Text Changed')
  }
}`,...(s=(t=r.parameters)==null?void 0:t.docs)==null?void 0:s.source}}};const m=["Default"];export{r as Default,m as __namedExportsOrder,x as default};
//# sourceMappingURL=InputTextarea.stories.dde8ec09.js.map
