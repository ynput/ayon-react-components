import{r as s,a as i,j as a}from"./jsx-runtime.be8e9395.js";import{s as t}from"./styled-components.browser.esm.5ef351f6.js";const n=t.div`
  --loader-size: 40px;
  display: inline-block;
  width: 80px;
  height: 80px;
  &:after {
    content: ' ';
    display: block;
    width: var(--loader-size);
    height: var(--loader-size);
    margin: 8px;
    border-radius: 50%;
    border: 4px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 0.8s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,l=t.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;

  .message {
    font-weight: bold;
  }
`,r=s.exports.forwardRef(({message:e,...d},o)=>i(l,{...d,ref:o,children:[a(n,{}),a("div",{className:"message",children:e})]}));try{r.displayName="LoaderShade",r.__docgenInfo={description:"",displayName:"LoaderShade",props:{message:{defaultValue:null,description:"",name:"message",required:!1,type:{name:"string"}}}}}catch{}try{LoaderShade.displayName="LoaderShade",LoaderShade.__docgenInfo={description:"",displayName:"LoaderShade",props:{message:{defaultValue:null,description:"",name:"message",required:!1,type:{name:"string"}}}}}catch{}export{r as L};
//# sourceMappingURL=index.33875fd5.js.map
