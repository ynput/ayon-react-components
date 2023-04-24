import{r as d,j as a,a as h}from"./jsx-runtime.be8e9395.js";import{s as p}from"./styled-components.browser.esm.5ef351f6.js";import"./_commonjsHelpers.712cc82f.js";const u=p.div`
  max-height: var(--base-input-size);
  min-height: var(--base-input-size);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .switch-body {
    --bheight: calc(var(--base-input-size) * 0.7);
    --bwidth: calc(var(--bheight) * 1.75);
    position: relative;
    display: inline-block;
    height: var(--bheight);
    width: var(--bwidth);

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    input:checked + .slider {
      background-color: var(--color-hl-00);
    }

    input:checked + .slider:before {
      transform: translateX(calc(var(--bheight) * 0.8));
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-grey-05);
      transition: 0.4s;
      border-radius: calc(var(--bheight) / 2);

      &:before {
        position: absolute;
        content: '';
        height: calc(var(--bheight) * 0.8);
        width: calc(var(--bheight) * 0.8);
        left: calc(var(--bheight) * 0.1);
        bottom: calc(var(--bheight) * 0.1);
        background-color: var(--color-grey-08);
        transition: 0.4s;
        border-radius: 50%;
      }
    }
  } // switch-body
`,r=d.exports.forwardRef(({switchStyle:t,switchClassName:l,...i},n)=>a(u,{style:t,className:`${l} ${i.className}`,children:h("label",{className:"switch-body",children:[a("input",{type:"checkbox",...i,ref:n}),a("span",{className:"slider"})]})}));try{r.displayName="InputSwitch",r.__docgenInfo={description:"",displayName:"InputSwitch",props:{switchClassName:{defaultValue:null,description:"",name:"switchClassName",required:!1,type:{name:"string"}},switchStyle:{defaultValue:null,description:"",name:"switchStyle",required:!1,type:{name:"CSSProperties"}}}}}catch{}try{InputSwitch.displayName="InputSwitch",InputSwitch.__docgenInfo={description:"",displayName:"InputSwitch",props:{switchClassName:{defaultValue:null,description:"",name:"switchClassName",required:!1,type:{name:"string"}},switchStyle:{defaultValue:null,description:"",name:"switchStyle",required:!1,type:{name:"CSSProperties"}}}}}catch{}const y={component:r,tags:["autodocs"]},e={args:{value:"true"}};var s,c,o;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    value: 'true'
  }
}`,...(o=(c=e.parameters)==null?void 0:c.docs)==null?void 0:o.source}}};const f=["Default"];export{e as Default,f as __namedExportsOrder,y as default};
//# sourceMappingURL=InputSwitch.stories.058152af.js.map
