import{r as m,j as i}from"./jsx-runtime.be8e9395.js";import{s as u,C as g}from"./styled-components.browser.esm.5ef351f6.js";const f=u.div`
  border-radius: 100%;
  aspect-ratio: 1/1;

  width: 30px;
  max-height: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  background-color: var(--color-grey-03);
  border: solid 1px var(--color-grey-06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* if highlight true make border green */
  ${({highlight:e})=>e&&g`
      border-color: var(--toastify-color-success);
    `}
`,s=m.exports.forwardRef(({src:e,fullName:a,size:r=30,highlight:n,...t},o)=>{const d=Math.round(.43333333333333335*r),c=a==null?void 0:a.split(" ").map(p=>{var l;return(l=p[0])==null?void 0:l.toUpperCase()}).splice(0,2).join("");return i(f,{style:{width:r,maxHeight:r,minHeight:r,...t.style},highlight:n,ref:o,...t,children:e?i("img",{src:e}):i("span",{style:{fontSize:`${d}px`},children:c})})});try{s.displayName="UserImage",s.__docgenInfo={description:"",displayName:"UserImage",props:{src:{defaultValue:null,description:"",name:"src",required:!1,type:{name:"string"}},fullName:{defaultValue:null,description:"",name:"fullName",required:!1,type:{name:"string"}},size:{defaultValue:{value:"30"},description:"",name:"size",required:!1,type:{name:"number"}},highlight:{defaultValue:null,description:"",name:"highlight",required:!1,type:{name:"boolean"}}}}}catch{}try{UserImage.displayName="UserImage",UserImage.__docgenInfo={description:"",displayName:"UserImage",props:{src:{defaultValue:null,description:"",name:"src",required:!1,type:{name:"string"}},fullName:{defaultValue:null,description:"",name:"fullName",required:!1,type:{name:"string"}},size:{defaultValue:{value:"30"},description:"",name:"size",required:!1,type:{name:"number"}},highlight:{defaultValue:null,description:"",name:"highlight",required:!1,type:{name:"boolean"}}}}}catch{}export{s as U};
//# sourceMappingURL=index.ecc29691.js.map
