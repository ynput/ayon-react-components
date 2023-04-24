import{D as C}from"./index.62925133.js";import{j as d,a as E,r as B}from"./jsx-runtime.be8e9395.js";import{B as M}from"./index.11db2722.js";import"./styled-components.browser.esm.5ef351f6.js";import"./_commonjsHelpers.712cc82f.js";import"./index.1a493964.js";import"./styles.38d859eb.js";import"./index.b8ae8ae1.js";const V={component:C,tags:["autodocs"]},r=[{value:"favorite",keyword:"like"},{value:"search",keyword:"find"},{value:"settings",keyword:"configuration"},{value:"home",keyword:"house"},{value:"account_circle",keyword:"user"},{value:"add",keyword:"create"},{value:"add_circle",keyword:"plus"},{value:"add_circle_outline",keyword:"empty_plus"},{value:"add_shopping_cart",keyword:"cart"},{value:"alarm",keyword:"clock"}],o=e=>{const[a,n]=B.exports.useState(e.value||[r[0].value]);return d(C,{...e,value:a,onChange:n,options:e.options||r})},t={args:{options:r.map(e=>({...e,icon:e.value})),multiSelect:!0,minSelected:1,widthExpand:!0},render:o},s={render:o},l={args:{searchFields:["value","keyword"],search:!0},render:o},c={args:{isMultiple:!0,value:[r[0].value,r[1].value],widthExpand:!0,multiSelect:!0,minSelected:2},render:o},i={args:{value:[r[0].value,r[1].value],options:r.map(e=>({...e,icon:e.value})),multiSelect:!0,widthExpand:!0,listStyle:{backgroundColor:"black"},valueTemplate:e=>d("div",{style:{background:"orange",borderRadius:3,padding:10,display:"flex"},children:e==null?void 0:e.map(a=>d(M,{label:a.toString(),icon:a.toString(),style:{marginLeft:4,backgroundColor:"unset",color:"black"},iconStyle:{color:"black"}}))}),itemTemplate:(e,a,n)=>E("div",{style:{background:a&&n?"orange":n?"#029cfd":"#292c2e",borderRadius:3,margin:4,padding:10},children:[n?"\u2713":" ",e==null?void 0:e.value]})},render:o};var u,p,m;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    options: options.map(option => ({
      ...option,
      icon: option.value
    })),
    multiSelect: true,
    minSelected: 1,
    widthExpand: true
  },
  render: Template
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var v,g,k;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: Template
}`,...(k=(g=s.parameters)==null?void 0:g.docs)==null?void 0:k.source}}};var S,y,b;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    searchFields: ['value', 'keyword'],
    search: true
  },
  render: Template
}`,...(b=(y=l.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var h,w,f;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    isMultiple: true,
    value: [options[0].value, options[1].value],
    widthExpand: true,
    multiSelect: true,
    minSelected: 2
  },
  render: Template
}`,...(f=(w=c.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var x,T,_;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    value: [options[0].value, options[1].value],
    options: options.map(option => ({
      ...option,
      icon: option.value
    })),
    multiSelect: true,
    widthExpand: true,
    listStyle: {
      backgroundColor: 'black'
    },
    valueTemplate: value => <div style={{
      background: 'orange',
      borderRadius: 3,
      padding: 10,
      display: 'flex'
    }}>
        {value?.map(v => <Button label={v.toString()} icon={v.toString()} style={{
        marginLeft: 4,
        backgroundColor: 'unset',
        color: 'black'
      }} iconStyle={{
        color: 'black'
      }} />)}
      </div>,
    itemTemplate: (option, isActive, isSelected) => <div style={{
      background: isActive && isSelected ? 'orange' : isSelected ? '#029cfd' : '#292c2e',
      borderRadius: 3,
      margin: 4,
      padding: 10
    }}>
        {isSelected ? '\u2713' : ' '}
        {option?.value}
      </div>
  },
  render: Template
}`,...(_=(T=i.parameters)==null?void 0:T.docs)==null?void 0:_.source}}};const q=["Icons","Basic","Search","Multiple","CustomTemplates"];export{s as Basic,i as CustomTemplates,t as Icons,c as Multiple,l as Search,q as __namedExportsOrder,V as default};
//# sourceMappingURL=Dropdown.stories.0839747e.js.map
