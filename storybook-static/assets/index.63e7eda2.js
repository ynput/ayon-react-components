import{s as i,C as p}from"./styled-components.browser.esm.5ef351f6.js";import{r as l,a as c,j as o}from"./jsx-runtime.be8e9395.js";const f=i.div`
  position: relative;

  width: 100%;
  display: flex;
  justify-content: ${({align:e})=>e==="left"?"flex-start":"flex-end"};
  overflow-x: clip;

  span:first-child {
    white-space: nowrap;
  }

  ${({isNode:e})=>!e&&p`
      margin-right: 4px;
    `}
`,u=i.span`
  /* overflow */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  padding: 0 3px;
`,v=i.span`
  position: absolute;
  background-color: var(--color-grey-01);
  border-radius: 3px;
  right: ${({align:e})=>e==="left"?"unset":0};
  left: ${({align:e})=>e==="left"?0:"unset"};
  word-break: break-all;
  cursor: pointer;
  max-width: 100%;
  z-index: 10;

  transition: height 0.2s;
  overflow-y: hidden;
  height: 18px;

  opacity: 0;
  padding: 0 3px;

  :hover {
    opacity: 1;
    height: auto;
    box-shadow: 0 0 8px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s;
  }
`,n=l.exports.forwardRef(({value:e="",style:d,align:t="right",onClick:a},s)=>{let r=!1;return e&&typeof e=="object"&&!Array.isArray(e)&&l.exports.isValidElement(e)&&(r=!0),c(f,{style:d,align:t,isNode:r,ref:s,children:[r?e:o(u,{children:e}),!r&&o(v,{onClick:()=>e&&a&&a(e.toString()),align:t,children:e})]})});try{n.displayName="OverflowField",n.__docgenInfo={description:"",displayName:"OverflowField",props:{value:{defaultValue:{value:""},description:"",name:"value",required:!1,type:{name:"ReactNode"}},align:{defaultValue:{value:"right"},description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((value: string) => void)"}}}}}catch{}try{OverflowField.displayName="OverflowField",OverflowField.__docgenInfo={description:"",displayName:"OverflowField",props:{value:{defaultValue:{value:""},description:"",name:"value",required:!1,type:{name:"ReactNode"}},align:{defaultValue:{value:"right"},description:"",name:"align",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"((value: string) => void)"}}}}}catch{}export{n as O};
//# sourceMappingURL=index.63e7eda2.js.map
