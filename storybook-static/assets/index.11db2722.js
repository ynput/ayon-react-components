import{r as s,a as d,j as u}from"./jsx-runtime.be8e9395.js";import{s as c,C as n}from"./styled-components.browser.esm.5ef351f6.js";import{I as p}from"./index.b8ae8ae1.js";const m=c.button`
  color: var(--color-text);
  background: var(--button-background);
  min-height: var(--base-input-size);
  max-height: var(--base-input-size);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: var(--base-input-border-radius);
  gap: var(--base-gap-medium);
  cursor: pointer;
  white-space: nowrap;

  .material-symbols-outlined {
    font-size: 1.5rem;
  }

  &:hover {
    background: var(--button-background-hover);
  }

  &:active {
    background: var(--button-background-hover);
  }

  &:focus {
    outline: 1px solid var(--color-hl-00);
  }

  &:disabled {
    color: var(--color-text-dim);
    cursor: not-allowed;

    &:hover {
      background: var(--button-background);
    }

    .material-symbols-outlined {
      color: var(--color-text-dim);
    }
  }

  // Circle tool buttons (for arrows and crosses/pluses in the settings editor)

  &.circle {
    border-radius: 50%;
    border: 1px solid var(--color-grey-03);
    background: transparent;
    padding: 0;
    justify-content: center;
    .material-symbols-outlined {
      font-size: 2rem;
    }
  }

  // Transparent button is used for the top level menus
  // (project sidebar and user menu)

  &.transparent {
    background: transparent;
    border: none;
    color: var(--color-text);
    justify-content: center;
    padding: 0;
    &:hover {
      background: transparent;
      .material-symbols-outlined {
        color: white;
      }
    }
    &:focus {
      outline: none;
      color: var(--color-hl-00);
      .material-symbols-outlined {
        color: var(--color-hl-00);
      }
    }
    .material-symbols-outlined {
      font-size: 2.2rem;
    }
  }

  // Without a label, button is considered an icon button
  // and should be square.
  ${({label:e})=>e&&n`
      min-width: var(--base-input-size);
      max-width: var(--base-input-size);
    `}

  /* if button is link */
  ${({link:e})=>e&&n`
      display: inline-block;
      border: 0;
      background: none;
      color: var(--color-hl-00);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`,a=s.exports.forwardRef(({label:e,icon:r,tooltip:l,link:t,iconStyle:b,...o},i)=>d(m,{title:l,link:t,...o,ref:i,children:[!t&&r&&u(p,{icon:r})," ",e," ",o.children]}));try{a.displayName="Button",a.__docgenInfo={description:"",displayName:"Button",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"string"}},tooltip:{defaultValue:null,description:"",name:"tooltip",required:!1,type:{name:"string"}},link:{defaultValue:null,description:"",name:"link",required:!1,type:{name:"boolean"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},iconStyle:{defaultValue:null,description:"",name:"iconStyle",required:!1,type:{name:"CSSProperties"}}}}}catch{}try{Button.displayName="Button",Button.__docgenInfo={description:"",displayName:"Button",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"string"}},tooltip:{defaultValue:null,description:"",name:"tooltip",required:!1,type:{name:"string"}},link:{defaultValue:null,description:"",name:"link",required:!1,type:{name:"boolean"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},iconStyle:{defaultValue:null,description:"",name:"iconStyle",required:!1,type:{name:"CSSProperties"}}}}}catch{}export{a as B};
//# sourceMappingURL=index.11db2722.js.map
