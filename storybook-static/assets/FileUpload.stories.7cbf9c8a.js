import{r as o,a as i,F as _,j as a}from"./jsx-runtime.be8e9395.js";import{s as V}from"./styled-components.browser.esm.5ef351f6.js";import"./_commonjsHelpers.712cc82f.js";const P=V.form`
  height: 200px;
  width: 300px;
  text-align: center;
  position: relative;

  input {
    display: none;
  }

  label {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border-width: 2px;
    border-radius: 1rem;
    border-style: dashed;
    border-color: #6b7685;
    background-color: transparent;

    &.drag-active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  span {
    font-size: 1.2rem;
  }

  small {
    color: #e53e3e !important;
    font-size: 0.8rem;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: #3182ce;
    font-weight: 600;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }

  #drag-file-element {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
  }
`,T=V.ul`
  list-style: none;
  padding: 10%;
  margin: 0;
  font-size: 0.8rem;
  overflow-y: auto;
  width: 100%;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      background-color: transparent;
      border: none;
      color: #e53e3e;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`,d=o.exports.forwardRef(({files:t,setFiles:l,mode:p="single",validExtensions:g,showMaxFiles:S=4,style:k,className:N,...C},U)=>{const[h,c]=o.exports.useState(!1),[y,v]=o.exports.useState(null),s=o.exports.useRef(null),x=p==="multiple"||p==="sequence",m=e=>{e.preventDefault(),e.stopPropagation(),e.type==="dragenter"||e.type==="dragover"?c(!0):e.type==="dragleave"&&c(!1)},b=e=>{const r=[];for(const n of e){if(g){const f=n.name.split(".").pop();if(!f||!g.includes(f)){v(`Invalid file type: ${f}`);return}}if(r.push(n),!x)break}v(null),r&&l(p==="single"?[r[0]]:n=>[...n||[],...r])},M=e=>{e.preventDefault(),e.stopPropagation(),c(!1),e.dataTransfer.files&&e.dataTransfer.files[0]&&b(e.dataTransfer.files)},E=e=>{e.preventDefault(),e.target.files&&e.target.files[0]&&b(e.target.files)},j=e=>{var r;(r=s.current)==null||r.click()},F=(e,r)=>{if(e.preventDefault(),e.stopPropagation(),r===-1)l([]),s.current&&(s.current.value="");else{const n=[...t];n.splice(r,1),l(n)}},z=o.exports.useMemo(()=>(t==null?void 0:t.length)>S?i(_,{children:[i("span",{children:[t.length," files selected"]}),a("button",{onClick:e=>F(e,-1),children:"clear"})]}):t!=null&&t.length?a(T,{children:t.map((e,r)=>i("li",{children:[e.name,a("button",{onClick:n=>F(n,r),children:"x"})]},r))}):i(_,{children:[a("span",{children:"Drag and drop your file here or"}),a("button",{className:"upload-button",onClick:j,children:"upload a file"}),a("small",{children:y})]}),[t,y]);return i(P,{onSubmit:e=>e.preventDefault(),style:k,className:N,ref:U,...C,children:[a("input",{ref:s,type:"file",id:"input-file-upload",multiple:x,onChange:E}),a("label",{id:"label-file-upload",htmlFor:"input-file-upload",className:h?"drag-active":"",children:z}),h&&a("div",{id:"drag-file-element",onDragEnter:m,onDragLeave:m,onDragOver:m,onDrop:M})]})});try{d.displayName="FileUpload",d.__docgenInfo={description:"",displayName:"FileUpload",props:{files:{defaultValue:null,description:"",name:"files",required:!0,type:{name:"File[]"}},setFiles:{defaultValue:null,description:"",name:"setFiles",required:!0,type:{name:"Dispatch<SetStateAction<File[]>>"}},mode:{defaultValue:{value:"single"},description:"",name:"mode",required:!1,type:{name:"enum",value:[{value:'"single"'},{value:'"multiple"'},{value:'"sequence"'}]}},validExtensions:{defaultValue:null,description:"",name:"validExtensions",required:!1,type:{name:"string[]"}},showMaxFiles:{defaultValue:{value:"4"},description:"",name:"showMaxFiles",required:!1,type:{name:"number"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{FileUpload.displayName="FileUpload",FileUpload.__docgenInfo={description:"",displayName:"FileUpload",props:{files:{defaultValue:null,description:"",name:"files",required:!0,type:{name:"File[]"}},setFiles:{defaultValue:null,description:"",name:"setFiles",required:!0,type:{name:"Dispatch<SetStateAction<File[]>>"}},mode:{defaultValue:{value:"single"},description:"",name:"mode",required:!1,type:{name:"enum",value:[{value:'"single"'},{value:'"multiple"'},{value:'"sequence"'}]}},validExtensions:{defaultValue:null,description:"",name:"validExtensions",required:!1,type:{name:"string[]"}},showMaxFiles:{defaultValue:{value:"4"},description:"",name:"showMaxFiles",required:!1,type:{name:"number"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const O={component:d,tags:["autodocs"]},A=()=>{const[t,l]=o.exports.useState([]);return a(d,{files:t,setFiles:l})},u={render:A};var q,D,w;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: Template
}`,...(w=(D=u.parameters)==null?void 0:D.docs)==null?void 0:w.source}}};const $=["Default"];export{u as Default,$ as __namedExportsOrder,O as default};
//# sourceMappingURL=FileUpload.stories.7cbf9c8a.js.map
