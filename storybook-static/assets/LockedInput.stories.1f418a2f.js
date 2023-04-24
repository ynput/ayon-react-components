import{r as s,a as m,j as a,F as h}from"./jsx-runtime.be8e9395.js";import{s as M}from"./styled-components.browser.esm.5ef351f6.js";import{I as j}from"./index.1a493964.js";import{B as d}from"./index.11db2722.js";import{D as W}from"./index.bc2f837d.js";import"./_commonjsHelpers.712cc82f.js";import"./styles.38d859eb.js";import"./index.b8ae8ae1.js";const R=M.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  input {
    flex: 1;
  }
`,f=s.exports.forwardRef(({value:t,onSubmit:e,onCancel:i,onEdit:r,label:n,disabled:l,saveLabel:o="Save",cancelLabel:V="Cancel",editIcon:C="edit",fullUnlock:u,type:U,...T},H)=>{const[S,b]=s.exports.useState(t),[c,g]=s.exports.useState(!1),N=()=>{b(t),g(!0)},w=()=>{g(!1),e&&e(S)},A=k=>{b(k.target.value),u&&e&&e(k.target.value)},F=()=>{g(!1),b(t),i&&i()};return s.exports.useEffect(()=>{l&&c&&g(!1)},[l,c]),m(R,{ref:H,...T,children:[a(j,{value:c?S:t,disabled:!c,onChange:A,type:U}),!l&&(c?m(h,{children:[a(d,{icon:u?"lock":"cancel",onClick:F,label:V}),!u&&a(d,{icon:"done",onClick:w,label:o})]}):a(d,{icon:C,onClick:r||N}))]},n)});try{f.displayName="LockedInput",f.__docgenInfo={description:"",displayName:"LockedInput",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"((value: string) => void)"}},onEdit:{defaultValue:null,description:"",name:"onEdit",required:!1,type:{name:"(() => void)"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!1,type:{name:"(() => void)"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},saveLabel:{defaultValue:{value:"Save"},description:"",name:"saveLabel",required:!1,type:{name:"string"}},cancelLabel:{defaultValue:{value:"Cancel"},description:"",name:"cancelLabel",required:!1,type:{name:"string"}},editIcon:{defaultValue:{value:"edit"},description:"",name:"editIcon",required:!1,type:{name:"string"}},fullUnlock:{defaultValue:null,description:"",name:"fullUnlock",required:!1,type:{name:"boolean"}},type:{defaultValue:null,description:"",name:"type",required:!1,type:{name:"HTMLInputTypeAttribute"}}}}}catch{}try{LockedInput.displayName="LockedInput",LockedInput.__docgenInfo={description:"",displayName:"LockedInput",props:{value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"((value: string) => void)"}},onEdit:{defaultValue:null,description:"",name:"onEdit",required:!1,type:{name:"(() => void)"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!1,type:{name:"(() => void)"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},saveLabel:{defaultValue:{value:"Save"},description:"",name:"saveLabel",required:!1,type:{name:"string"}},cancelLabel:{defaultValue:{value:"Cancel"},description:"",name:"cancelLabel",required:!1,type:{name:"string"}},editIcon:{defaultValue:{value:"edit"},description:"",name:"editIcon",required:!1,type:{name:"string"}},fullUnlock:{defaultValue:null,description:"",name:"fullUnlock",required:!1,type:{name:"boolean"}},type:{defaultValue:null,description:"",name:"type",required:!1,type:{name:"HTMLInputTypeAttribute"}}}}}catch{}const Y={component:f,tags:["autodocs"]},p={args:{value:"first.last.name",placeholder:"Username...",onEdit:void 0}},v={args:p.args,render:t=>{const[e,i]=s.exports.useState(t.value),[r,n]=s.exports.useState(e),[l,o]=s.exports.useState(!1);return m(h,{children:[a(f,{value:e,onEdit:()=>o(!0)}),l&&a(W,{header:"Edit Username",visible:l,onHide:()=>o(!1),footer:m(h,{children:[a(d,{onClick:()=>{n(e),o(!1)},children:"Cancel"}),a(d,{onClick:()=>{i(r),o(!1)},children:"Save"})]}),children:a(j,{value:r,onChange:u=>n(u.target.value)})})]})}},y={render:()=>{const t=["bob","joe","jane"],[e,i]=s.exports.useState(["bob"]),r=n=>{e.includes(n)?i(e.filter(l=>l!==n)):i([...e,n])};return m("div",{style:{maxWidth:200},children:[a("div",{style:{display:"flex",gap:"1rem",marginBottom:"1rem"},children:t.map(n=>a(d,{label:n,onClick:()=>r(n),style:{outline:e.includes(n)?"1px solid green":"none"}},n))}),a(f,{value:e.join(", "),disabled:e.length>1})]})}};var x,q,I;p.parameters={...p.parameters,docs:{...(x=p.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    value: 'first.last.name',
    placeholder: 'Username...',
    onEdit: undefined
  }
}`,...(I=(q=p.parameters)==null?void 0:q.docs)==null?void 0:I.source}}};var L,E,_;v.parameters={...v.parameters,docs:{...(L=v.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: Default.args,
  render: args => {
    const [value, setValue] = useState(args.value);
    const [editingValue, setEditingValue] = useState(value);
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleSave = () => {
      setValue(editingValue);
      setDialogOpen(false);
    };
    const handleCancel = () => {
      setEditingValue(value);
      setDialogOpen(false);
    };
    return <>
        <LockedInput value={value} onEdit={() => setDialogOpen(true)} />
        {dialogOpen && <Dialog header="Edit Username" visible={dialogOpen} onHide={() => setDialogOpen(false)} footer={<>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </>}>
            <InputText value={editingValue} onChange={e => setEditingValue(e.target.value)} />
          </Dialog>}
      </>;
  }
}`,...(_=(E=v.parameters)==null?void 0:E.docs)==null?void 0:_.source}}};var D,O,B;y.parameters={...y.parameters,docs:{...(D=y.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => {
    const names = ['bob', 'joe', 'jane'];
    const [selected, setSelected] = useState(['bob']);
    const handleButtonClick = (name: string) => {
      // add or remove name from selected
      if (selected.includes(name)) {
        setSelected(selected.filter(n => n !== name));
      } else {
        setSelected([...selected, name]);
      }
    };
    return <div style={{
      maxWidth: 200
    }}>
        <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
          {names.map(name => <Button key={name} label={name} onClick={() => handleButtonClick(name)} style={{
          outline: selected.includes(name) ? '1px solid green' : 'none'
        }} />)}
        </div>
        <LockedInput value={selected.join(', ')} disabled={selected.length > 1} />
      </div>;
  }
}`,...(B=(O=y.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};const Z=["Default","OpenDialog","Disabled"];export{p as Default,y as Disabled,v as OpenDialog,Z as __namedExportsOrder,Y as default};
//# sourceMappingURL=LockedInput.stories.1f418a2f.js.map
