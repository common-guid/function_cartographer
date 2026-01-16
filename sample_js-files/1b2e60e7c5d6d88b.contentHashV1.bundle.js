"use strict";(self.webpackChunk_hex_client=self.webpackChunk_hex_client||[]).push([["19421"],{901176:function(e,n,t){t.d(n,{Fw:()=>s,Gy:()=>r,SK:()=>a});var l=t(171155),i=t(926246);let s=i.default.div.withConfig({displayName:"shared__SearchBarWrapper",componentId:"sc-7ba4e4ba-0"})(["width:100%;margin-top:10px;.","{border-bottom-right-radius:0;border-bottom-left-radius:0;}"],l.bOq),a=i.default.div.withConfig({displayName:"shared__SelectWrapper",componentId:"sc-7ba4e4ba-1"})(["",""],e=>{let{$enabled:n}=e;return!n&&(0,i.css)(["opacity:0.4;pointer-events:none;"])}),r={matchTargetWidth:!0,minimal:!0}},723221:function(e,n,t){t.d(n,{M:()=>$}),t(390701),t(886587),t(931609);var l=t(295709),i=t(171155),s=t(314478),a=t(672285),r=t(51945),o=t(926246),c=t(574488),d=t(264144);t(101802),t(153559),t(104438);var u=t(423661),m=t.n(u),p=t(177934),h=t.n(p),g=t(791542),x=t.n(g),f=t(79127),b=t(192747),C=t(891266);let y=r.memo(r.forwardRef(function(e,n){let{children:t,count:i,direction:s="row",onOverflowingChange:o,partialMinWidth:c,renderEndDecorator:d,strategy:u="complete",...m}=e,[p,h]=(0,r.useState)(null),[g,f]=(0,r.useState)(null),[y,S]=(0,r.useState)(null),[I,R]=(0,r.useState)(0),E=i-I,T=(0,r.useMemo)(()=>t({overflowCount:E}),[t,E]),A=r.Children.toArray(T);_(function(){let[e,n]=(0,r.useState)(!1);return(0,r.useCallback)(()=>n(e=>!e),[])}(),p,100,x()),(0,r.useLayoutEffect)(()=>{if(!p||!g||!(0,C.uW)())return;let e=function(e){var n;let{containerEl:t,count:l,direction:i,endDecoratorEl:s,partialMinWidth:r,sizerEl:o,strategy:c}=e,d="row-reverse"===i||"column-reverse"===i,u="row"===i||"row-reverse"===i?"clientWidth":"clientHeight",m=null!=(n=null==s?void 0:s[u])?n:0,p=t[u]-m,h=o[u]-m,g=Array.from(o.children),[x,f]=d?[0,g.length-1]:[g.length-1,0],b=h;for(let e=x;e>=f;d?e+=1:e-=1){if(b<=p)if("complete"===c)return Math.min(e+1,l);else if("partial"===c)if(null==r)return Math.min(e+2,l);else if(p-b>=r)return Math.min(e+2,l);else return Math.min(e+1,l);else(0,a.ew)(c,c);b-=g[e][u]}if("partial"===c){if(null==r)return Math.min(1,l);else if(p>=r)return Math.min(1,l)}return 0}({containerEl:p,endDecoratorEl:y,count:i,direction:s,partialMinWidth:c,sizerEl:g,strategy:u});e!==I&&R(e),null==o||o(e!==i)});let N=A.slice(0,I),k=(0,r.useMemo)(()=>d({ref:S},{count:i,overflowCount:E}),[d,i,E]),D=(0,b.tE)(n,h);return(0,l.jsxs)(v,{ref:D,direction:s,justify:"start",...m,"data-dynamic-flex-render":"visible",children:[N,k,(0,l.jsx)(j,{ref:f,justify:"start",...m,children:(0,l.jsxs)(w.Provider,{value:!0,children:[T,k]})})]})})),v=(0,o.default)(f.s).withConfig({displayName:"OverflowAwareFlex__DynamicFlexContainer",componentId:"sc-7490b230-0"})(["position:relative;width:100%;height:100%;"]),j=(0,o.default)(f.s).withConfig({displayName:"OverflowAwareFlex__DynamicFlexSizer",componentId:"sc-7490b230-1"})(["position:absolute;visibility:hidden;pointer-events:none;"]),w=(0,r.createContext)(!1),_=function(e,n){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:250,l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:m(),i=(0,r.useRef)(e);i.current=e,(0,r.useLayoutEffect)(()=>{n&&i.current((0,C.Z$)(n))},[n,i]);let s=(0,r.useCallback)(l(()=>{n&&i.current((0,C.Z$)(n))},t),[n,i]);(0,r.useEffect)(()=>{if(!n)return h();let e=new ResizeObserver(s);return e.observe(n),()=>{e.disconnect()}},[s,n])};function S(e){let n="";return e.cell.onlyExistsInPublished&&(n+="*"),e.cell.label?n+=e.cell.label:null!=e.cell.unnamedCellIndex&&(n+=`Unnamed Cell ${e.cell.unnamedCellIndex+1}`),n}var I=t(869168),R=t(237376),E=t(826511);let T=r.memo(r.forwardRef(function(e,n){let{cell:t,...i}=e,o=(0,r.useMemo)(()=>(function(e){let n,{cell:t}=e,l=t.hexVersion.hex.hexType,i=(0,I.FM)(t.hexVersion.hex.id,t.hexVersion.hex.title),r=t.hexVersion.version===s.MPw.DRAFT?s.MPw.DRAFT:s.MPw.LAST_PUBLISHED,o=t.staticId;return l===s.K$B.PROJECT?n=E.BV.LOGIC.href(R.Xs,!0,{hexLocator:i,version:r,queryParams:{selectedStaticCellId:o}}):l===s.K$B.ASK?n=void 0:l===s.K$B.EXPLORE?n=E.BV.EXPLORE.href(R.Xs,!0,{hexLocator:i}):l===s.K$B.COMPONENT?n=E.BV.COMPONENT.href(R.Xs,!0,{hexLocator:i,version:r,queryParams:{selectedStaticCellId:o}}):(0,a.ew)(l,l),n})({cell:t}),[t]);return(0,l.jsx)("a",{ref:n,href:o,...i})})),A=(0,o.default)(T).withConfig({displayName:"UsagesCellLink__UsageCellLink",componentId:"sc-397b84e9-0"})(["color:inherit;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;overflow-wrap:normal;&:hover{color:inherit;}&:visited{color:inherit;}"]);t(820295);var N=t(170899),k=t(242972),D=t(685602);let P=r.memo(function(e){let{cells:n}=e;return(0,l.jsxs)(c.so,{align:"stretch",direction:"column",gap:6,children:[(0,l.jsxs)(D.DZ,{renderAs:"h3",styleAs:"h5",children:[n.length," ",(0,N.r)(n.length,"Cell","Cells")]}),(0,l.jsx)(O,{direction:"column",gap:6,children:n.map(e=>(0,l.jsxs)(M,{gap:4,children:[(0,l.jsx)(k.m,{cellType:e.cellType}),(0,l.jsx)(c.Dy,{ellipsize:!0,fontColor:"muted",fontSize:"small",children:(0,l.jsx)(A,{cell:e,children:S({cell:e})})})]},e.id))}),n.some(e=>e.onlyExistsInPublished)&&(0,l.jsx)(L,{fontColor:"muted",fontSize:"extra_small",children:"* Only exists in published version"})]})}),O=(0,o.default)(c.so).withConfig({displayName:"UsagesPopoverContent__CellListFlex",componentId:"sc-7a1bef16-0"})(["max-height:240px;overflow-y:auto;overflow-x:hidden;"]);var M=(0,o.default)(c.so).withConfig({displayName:"UsagesPopoverContent___StyledFlex",componentId:"sc-7a1bef16-1"})(["max-width:100%;"]),L=(0,o.default)(c.Dy).withConfig({displayName:"UsagesPopoverContent___StyledTxt",componentId:"sc-7a1bef16-2"})(["margin-top:6px;"]);let $=r.memo(function(e){let{data:n}=e;return null==n.cells||n.hexType===s.K$B.EXPLORE||n.hexType===s.K$B.ASK?null:n.hexType===s.K$B.PROJECT||n.hexType===s.K$B.COMPONENT?(0,l.jsx)(F,{data:{cells:n.cells}}):((0,a.ew)(n.hexType,n.hexType),null)}),F=r.memo(function(e){let{data:n}=e,t=n.cells.length,[i,s]=(0,r.useState)(!1),a=(0,r.useCallback)(e=>{let{isOpen:i,...a}=e;return(0,l.jsx)(y,{count:t,partialMinWidth:52,renderEndDecorator:U,strategy:"partial",onOverflowingChange:s,...a,children:e=>n.cells.map((n,i)=>(0,l.jsxs)(c.Dy,{ellipsize:t-e.overflowCount===i+1,fontColor:"muted",fontSize:"small",title:void 0,children:[i>0&&", ",n.onlyExistsInPublished?(0,l.jsx)(c.xk,{alignContent:"left",content:"Only exists in published version",position:"bottom-left",renderTarget:e=>{let{isOpen:t,...i}=e;return(0,l.jsx)(A,{cell:n,...i,children:S({cell:n})})}}):(0,l.jsx)(A,{cell:n,children:S({cell:n})})]},n.id))})},[t,n.cells]);return(0,l.jsx)(B,{content:(0,l.jsx)(P,{cells:n.cells}),disabled:!i,interactionKind:"hover",placement:"right-start",renderTarget:a})}),U=(e,n)=>{let{count:t,overflowCount:i}=n;return 0===i?null:t===i?(0,l.jsxs)(c.Dy,{ellipsize:!0,fontColor:"muted",fontSize:"small",...e,children:[t," cells"]}):(0,l.jsxs)(c.Dy,{fontColor:"muted",fontSize:"small",...e,children:[", +",i]})},B=(0,o.default)(d.aM).withConfig({displayName:"UsagesTableCellRenderer__StyledHexPopover",componentId:"sc-d4a42bcf-0"})([".","{background:",";max-width:306px;padding:12px;}.","{background:",";}"],i.Q9N,e=>{let{theme:n}=e;return n.backgroundColor.MUTED},i.AFD,e=>{let{theme:n}=e;return n.backgroundColor.MUTED})},763524:function(e,n,t){t.d(n,{n:()=>B}),t(390701),t(886587),t(966141),t(606688),t(931609),t(974102),t(73952),t(808489),t(728256),t(200431),t(728388),t(121502),t(218505),t(761683),t(733885),t(533915),t(791060),t(474597),t(515183),t(518528),t(803743),t(877254),t(790642),t(635498),t(820660),t(139538),t(622439),t(210259),t(116128);var l=t(295709),i=t(379633),s=t(171155),a=t(669456),r=t(856625),o=t(314478),c=t(881042),d=t(227368),u=t(701328),m=t(51945),p=t(926246),h=t(163189),g=t(574488),x=t(919568),f=t(405500),b=t(54172),C=t(237376),y=t(826511),v=t(831230),j=t(277170),w=t(98514),_=t(899778),S=t(167268),I=t(753774),R=t(12298),E=t(152487),T=t(741922);let A={},N=(0,i.J1)`
  fragment PotentialCollectionFragment on Collection {
    id
    name
    emoji
    canManage
    description
    collectionGrants {
      id
      ...CollectionGrantFragment
    }
  }
  ${R.nL}
`,k=(0,i.J1)`
  query ShareProjectGrantsAndCollections(
    $searchString: String!
    $orgId: OrgId!
    $includeCollectionsInResults: Boolean!
  ) {
    searchOrgUsers(orgId: $orgId, searchString: $searchString, pageSize: 10) {
      id
      ...UserPermissionFragment
    }
    searchOrgGroups(orgId: $orgId, searchString: $searchString, pageSize: 10) {
      id
      ...GroupPermissionFragment
    }
    collections(
      after: null
      before: null
      first: 10
      last: null
      ownershipLevel: ALL
      searchTerm: $searchString
    ) @include(if: $includeCollectionsInResults) {
      edges {
        node {
          id
          ...PotentialCollectionFragment
        }
      }
    }
  }
  ${E.Jg}
  ${E.x1}
  ${N}
`;var D=t(732858);(0,i.J1)`
  fragment PotentialCollectionFragment on Collection {
    id
    name
    emoji
    canManage
    description
    collectionGrants {
      id
      ...CollectionGrantFragment
    }
  }
`,(0,i.J1)`
  query ShareProjectGrantsAndCollections(
    $searchString: String!
    $orgId: OrgId!
    $includeCollectionsInResults: Boolean!
  ) {
    searchOrgUsers(orgId: $orgId, searchString: $searchString, pageSize: 10) {
      id
      ...UserPermissionFragment
    }
    searchOrgGroups(orgId: $orgId, searchString: $searchString, pageSize: 10) {
      id
      ...GroupPermissionFragment
    }
    collections(
      after: null
      before: null
      first: 10
      last: null
      ownershipLevel: ALL
      searchTerm: $searchString
    ) @include(if: $includeCollectionsInResults) {
      edges {
        node {
          id
          ...PotentialCollectionFragment
        }
      }
    }
  }
`;let P=p.default.div.withConfig({displayName:"AddPermissionsBar__AddUserBarDiv",componentId:"sc-1041d434-0"})(["display:flex;"]),O=p.default.div.withConfig({displayName:"AddPermissionsBar__AddUserForm",componentId:"sc-1041d434-1"})(["display:flex;gap:2px;flex:1 1 auto;min-width:0;"]),M=p.default.div.withConfig({displayName:"AddPermissionsBar__AddUserInput",componentId:"sc-1041d434-2"})(["display:flex;flex:1 1 auto;min-width:0;"]),L=p.default.div.withConfig({displayName:"AddPermissionsBar__RoleDropdownWrapper",componentId:"sc-1041d434-3"})(["flex:none;padding-top:2px;"]),$=p.default.div.withConfig({displayName:"AddPermissionsBar__AddUserButtonDiv",componentId:"sc-1041d434-4"})(["flex:none;"]),F=(0,p.default)(x.jm).withConfig({displayName:"AddPermissionsBar__StyledHexMultiSelect",componentId:"sc-1041d434-5"})(["min-width:0;.","{&::placeholder{color:",";font-size:",";}}&& .",",&& .",".","{box-shadow:none;}"],s.bqX,e=>{let{theme:n}=e;return n.fontColor.PLACEHOLDER},e=>{let{theme:n}=e;return n.fontSize.LARGE},s.bOq,s.bOq,s.HcD),U=/[,\n\r;]/,B=(0,j.v)(function(e){var n;let{addPotentialProjectGrants:t,allowUserCreation:i,disablePlaceholder:p,disabled:x=!1,existingCollectionIds:j,existingEmails:R,existingGroupIds:E,includeCollectionsInResults:N=!1,onClose:B,onOpen:V,potentialProjectGrants:q,potentialRole:z,rolePicker:G,setPotentialProjectGrants:W,supportUserId:H}=e,J=(0,f.i)(),X=(null==J?void 0:J.orgRole)===o.XTy.ADMIN,K=J&&(0,c.qM)(J.orgRole,o.XTy.MEMBER),Y=(0,b.p)({to:y.BV.SETTINGS.getUrl({subView:"users"}),target:"_blank"}),Q=(0,m.useRef)(!0),[Z,ee]=(0,m.useState)(""),en=(0,m.useCallback)(e=>{let n=e.split(U);n.length>1?(n.pop(),W(e=>[...e,...n.filter(n=>!e.find(e=>"user"===e.type&&e.email===n)).map(e=>({type:"user",email:e}))]),ee("")):ee(e)},[ee,W]),[et]=(0,h.d7)(Z,200,{maxWait:600}),{data:el,error:ei,loading:es}=function(e){let n={...A,...e};return T.I(k,n)}({fetchPolicy:"cache-and-network",variables:{searchString:et,orgId:C.Xs,includeCollectionsInResults:N}});(0,m.useEffect)(()=>{el&&et.length>0&&(Q.current=!1)},[el,et]);let[ea,er]=(0,m.useState)(null),eo=(0,m.useMemo)(()=>new Set(q.map(e=>"user"===e.type?e.email:void 0).filter(d.z)),[q]),ec=(0,m.useMemo)(()=>{var e,n,t,l;let i=new Set(q.map(e=>"group"===e.type?e.id:void 0).filter(d.z)),s=null!=(n=null==el?void 0:el.searchOrgUsers.filter(e=>e.active&&e.orgRole!==o.XTy.ANONYMOUS&&e.orgRole!==o.XTy.EMBEDDED_USER&&e.id!==H&&!R.has(e.email)&&!eo.has(e.email)).sort((e,n)=>e.email.localeCompare(n.email)).map(e=>({...e,type:"user"})))?n:[],a=null!=(t=null==el?void 0:el.searchOrgGroups.filter(e=>!i.has(e.id)&&!E.has(e.id)).sort((e,n)=>e.groupName.localeCompare(n.groupName)).map(e=>({type:"group",id:e.id,name:e.groupName})))?t:[],r=new Set(q.map(e=>"collection"===e.type?e.id:void 0).filter(d.z));return[...a,...s,...null!=(l=null==el||null==(e=el.collections)?void 0:e.edges.filter(e=>{let{node:n}=e;return!r.has(n.id)&&!(null==j?void 0:j.has(n.id))}).sort((e,n)=>e.node.name.localeCompare(n.node.name)).map(e=>{let{node:n}=e;return{type:"collection",id:n.id,name:n.name,canManage:n.canManage,emoji:n.emoji?n.emoji:void 0,collectionGrants:n.collectionGrants,description:n.description?n.description:void 0}}))?l:[]]},[q,null==el?void 0:el.searchOrgUsers,null==el?void 0:el.searchOrgGroups,null==el||null==(n=el.collections)?void 0:n.edges,H,R,eo,E,j]),ed=(0,m.useCallback)((e,n)=>{W(n=>n.filter(n=>"user"===n.type&&"user"===e.type?n.email!==e.email:"group"===n.type&&"group"===e.type?n.id!==e.id:"collection"!==n.type||"collection"!==e.type||n.id!==e.id))},[W]),eu=(0,m.useMemo)(()=>q.every(e=>"user"!==e.type||u.Xw.test((0,u._h)(e.email))),[q]),em=(0,m.useCallback)(()=>{q.length>0?(t({projGrants:q,role:z}),W([])):Z.length>0&&u.Xw.test((0,u._h)(Z))&&i&&(t({projGrants:[{type:"user",email:Z}],role:z}),en(""))},[t,i,z,q,Z,W,en]),ep=(0,m.useCallback)(e=>({type:"user",email:e}),[]),eh=(0,m.useCallback)((e,n,t)=>(0,l.jsx)(g.C9,{active:n,text:`Invite ${e}`,onClick:t},e),[]),eg=(0,m.useCallback)((e,n)=>{if(!n.modifiers.matchesPredicate)return null;if("user"===e.type){var t,i;return(0,l.jsx)(g.C9,{active:n.modifiers.active,disabled:n.modifiers.disabled,icon:(0,l.jsx)(I.H,{active:!0,email:e.email,imageUrl:null!=(t=e.imageUrl)?t:void 0,name:null!=(i=e.name)?i:void 0,size:20}),label:null!=e.name?e.email:void 0,text:e.name||e.email,onClick:n.handleClick},e.email)}return"group"===e.type?(0,l.jsx)(g.C9,{active:n.modifiers.active,disabled:n.modifiers.disabled,icon:(0,l.jsx)(S.h,{name:e.name}),text:e.name,onClick:n.handleClick},`${e.name}-${n.index}`):(0,l.jsx)(D.x,{collectionGrants:e.collectionGrants,disabledMessage:"You must be a collection manager to add projects to this collection.",emoji:e.emoji,handleClick:n.handleClick,isActive:n.modifiers.active,isDisabled:n.modifiers.disabled||!e.canManage,name:e.name},`${e.name}-${n.index}`)},[]),ex=(0,m.useCallback)(e=>{let{items:n,itemsParentRef:t,query:i,renderCreateItem:s,renderItem:r}=e,o=n.filter(e=>"user"===e.type),c=n.filter(e=>"group"===e.type),d=n.filter(e=>"collection"===e.type),m=N&&d.length>0;return(0,l.jsx)(g.RQ,{ulRef:t,children:es||Q.current?(0,l.jsx)(g.C9,{disabled:!0,text:(0,l.jsx)(g.L2,{size:g.Jj.STANDARD})}):null!=ei?(0,l.jsx)(g.C9,{disabled:!0,text:"Search failed"}):c.length>0||o.length>0||m?(0,l.jsxs)(l.Fragment,{children:[c.length>0&&o.length>0&&(0,l.jsxs)(w.V,{children:["Groups",(0,l.jsx)(g.xk,{content:X?(0,l.jsxs)(l.Fragment,{children:["As an admin, you can manage your groups and members in ",(0,l.jsx)("a",{...Y,children:"settings"}),"."]}):(0,l.jsxs)(l.Fragment,{children:["Only admins can manage group members. Reach out to"," ",(0,l.jsx)("a",{...Y,children:"a workspace admin"})," ","to edit."]}),interactionKind:a.E.HOVER,children:(0,l.jsx)(_.mo0,{})})]}),c.map((e,n)=>r(e,n)),c.length>0&&o.length>0&&(0,l.jsx)(w.V,{$spaceAbove:!0,children:"Users"}),o.map((e,n)=>r(e,n+c.length)),m&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(w.V,{$spaceAbove:!0,children:"Collections"}),d.map((e,n)=>r(e,n+c.length+o.length))]})]}):!u.Xw.test((0,u._h)(i))||R.has(i)||eo.has(i)?(0,l.jsx)(g.C9,{disabled:!0,text:"No results"}):s()})},[Y,eo,R,N,X,ei,es,Q]),ef=(0,m.useCallback)((e,n)=>"user"===e.type&&"user"===n.type?e.email===n.email:"group"===e.type&&"group"===n.type&&e.id===n.id,[]),eb=(0,m.useCallback)(e=>"user"===e.type?null!=e.name?(0,l.jsx)(g.xk,{content:e.email,children:(0,l.jsx)("span",{"data-tag-type":"user-name",children:e.name})}):(0,l.jsx)("span",{"data-tag-type":"user-email",children:e.email}):(0,l.jsx)("span",{"data-tag-type":"group",children:e.name}),[]),eC=(0,m.useCallback)((e,n)=>{null==n||n.stopPropagation(),W(n=>n.concat(e)),en(""),er(null)},[W,en]),ey=(0,m.useMemo)(()=>({minimal:!0,canEscapeKeyClose:!0,onClosed:B,onOpened:V,matchTargetWidth:!0}),[V,B]),ev=(0,m.useCallback)((e,n)=>{let t=r.J.NONE;return"user-email"!==e.props["data-tag-type"]||u.Xw.test((0,u._h)(e.props.children))||(t=r.J.DANGER),{minimal:!0,intent:t}},[]),ej=(0,m.useMemo)(()=>({className:s.I5l,inputProps:{"data-test":v.TF.SHARE_INPUT,autoFocus:!0,onBlur:()=>{Q.current=!1}},intent:eu?r.J.NONE:r.J.DANGER,leftIcon:(0,l.jsx)(_.REV,{className:s.k5o}),placeholder:p?"":K?N?"Users, groups, or collections...":"Users or groups":"Users by email",separator:U,tagProps:ev,onBlur:em}),[eu,K,p,N,em,ev]),ew=(0,m.useMemo)(()=>q.length>0,[q]),e_=(0,m.useMemo)(()=>x||!eu||0===q.length&&0===Z.length||Z.length>0&&!u.Xw.test((0,u._h)(Z))&&!R.has(Z)&&!eo.has(Z),[eu,eo,x,R,q,Z]);return(0,l.jsx)(P,{"data-test":v.TF.SHARE_CONTAINER,children:(0,l.jsxs)(O,{children:[(0,l.jsxs)(M,{children:[(0,l.jsx)(F,{activeItem:ea,createNewItemFromQuery:i?ep:void 0,createNewItemRenderer:i?eh:void 0,disabled:x,fill:!0,itemListRenderer:ex,itemRenderer:eg,items:ec,itemsEqual:ef,popoverProps:ey,query:Z,resetOnQuery:!0,selectedItems:q,tagInputProps:ej,tagRenderer:eb,onActiveItemChange:er,onItemSelect:eC,onQueryChange:en,onRemove:ed}),ew&&(0,l.jsx)(L,{children:G})]}),(0,l.jsx)($,{children:ew&&(0,l.jsx)(g.YE,{"data-test":v.TF.ADD_SHARE,disabled:e_,intent:"success",text:"Add",onClick:em})})]})})})},732858:function(e,n,t){t.d(n,{x:()=>o});var l=t(295709),i=t(51945),s=t(6052),a=t(716924),r=t(316643);let o=i.memo(function(e){let{collectionGrants:n,disabledMessage:t,emoji:i,handleClick:o,isActive:c=!1,isDisabled:d=!1,name:u}=e;return(0,l.jsx)(s.O0,{active:c,htmlTitle:u,icon:(0,l.jsx)(r.u,{emoji:i}),isMenuDisabled:d,isTooltipDisabled:!d,labelElement:(0,l.jsx)(a.V,{collectionGrants:n,disableTooltip:d,minimal:!0}),text:u,tooltipContent:t,tooltipPlacement:"left",onClick:o})})},321345:function(e,n,t){t.d(n,{M:()=>f}),t(390701),t(886587),t(931609);var l=t(295709),i=t(171155),s=t(332554),a=t(787161),r=t(51945),o=t(926246),c=t(574488),d=t(712610),u=t(97947),m=t(558366),p=t(899778);let h=o.default.div.withConfig({displayName:"CollectionRoleDropdown__Container",componentId:"sc-e3c21de1-0"})(["width:100%;"]),g=(0,o.default)(c.YE).withConfig({displayName:"CollectionRoleDropdown__RoleButton",componentId:"sc-e3c21de1-1"})(["justify-content:space-between;outline:none;",""],e=>{let{small:n}=e;return n&&"padding-right: 3px;"}),x=(0,o.default)(c.RQ).withConfig({displayName:"CollectionRoleDropdown__StyledMenu",componentId:"sc-e3c21de1-2"})(["min-width:90px;max-width:290px;padding:7px;.","{margin:7px 8px;}"],i.oru),f=r.memo(function(e){let{additionalActions:n,disabled:t=!1,onSelectRole:i,selectedRole:o}=e,[f,,{setFalse:b,toggle:C}]=(0,d.H)(!1),y=(0,r.useCallback)(e=>{i(e),b()},[i,b]);return(0,l.jsx)(h,{children:(0,l.jsx)(c.HG,{captureDismiss:!0,content:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(x,{children:(0,l.jsxs)(l.Fragment,{children:[s.B7.map((e,n)=>(0,l.jsx)(m.t,{currentRole:o,description:(0,s.TP)(e),label:(0,s.Gl)(e),role:e,onSelectRole:y},n)),n]})}),(0,l.jsx)(c.EW,{children:(0,l.jsx)(u.c,{to:a.sH.CollectionsPermissions,children:"Learn more about permissions"})})]}),disabled:t,isOpen:f,minimal:!0,placement:"bottom-end",onClose:b,children:(0,l.jsx)(g,{active:f,disabled:t,minimal:!0,rightIcon:(0,l.jsx)(p.pcN,{}),small:!0,onClick:C,children:(0,s.Gl)(o)})})})})},138521:function(e,n,t){t.d(n,{o:()=>d});var l=t(295709),i=t(51945),s=t(926246),a=t(826511),r=t(899778),o=t(443103);let c=s.default.div.withConfig({displayName:"OrgOrPublicAvatar__ImageDiv",componentId:"sc-2d1eb31d-0"})(["display:flex;flex:none;align-items:center;justify-content:center;width:30px;height:30px;color:",";font-size:",";background-color:",";border:1px solid ",";border-radius:",";"],e=>{let{theme:n}=e;return n.highlightColor},e=>{let{theme:n}=e;return n.fontSize.EXTRA_LARGE},e=>{let{theme:n}=e;return n.backgroundColor.MUTED},e=>{let{theme:n}=e;return n.borderColor.DEFAULT},e=>{let{theme:n}=e;return n.borderRadius}),d=i.memo(function(e){let{hasCustomAppIcon:n,isPublicIcon:t=!1,orgId:i,orgName:s,size:d=30}=e;if(t)return(0,l.jsx)(c,{children:(0,l.jsx)(r.fCU,{})});let u=n?a.BV.APP_ICON.getUrl({orgId:i}):null;return null!=u?(0,l.jsx)(o.eu,{active:!0,altText:s,imageUrl:u,shape:"square",size:d,text:s}):(0,l.jsx)(c,{children:s.charAt(0)})})},7335:function(e,n,t){t.d(n,{Jg:()=>N,VC:()=>O,ww:()=>k}),t(886587),t(931609),t(331924),t(483713),t(966141);var l=t(295709),i=t(856625),s=t(774429),a=t(314478),r=t(881042),o=t(672285),c=t(813181),d=t(787161),u=t(51945),m=t(926246),p=t(574488),h=t(975843),g=t(405500),x=t(826511),f=t(990106),b=t(170899),C=t(920053),y=t(97947),v=t(899778),j=t(443103),w=t(753774);let _=m.default.div.withConfig({displayName:"PermissionRow__Container",componentId:"sc-59b63cba-0"})(["display:flex;align-items:center;justify-content:space-between;padding:6px 16px;transition:background-color ",";&:hover{background-color:",";}"],e=>{let{theme:n}=e;return`${n.animation.duration} ${n.animation.easing}`},e=>{let{theme:n}=e;return n.hoverColor}),S=m.default.div.withConfig({displayName:"PermissionRow__UserErrorDiv",componentId:"sc-59b63cba-1"})(["flex:none;width:28px;"]),I=m.default.div.withConfig({displayName:"PermissionRow__UserDiv",componentId:"sc-59b63cba-2"})(["display:flex;flex-grow:1;gap:8px;align-items:center;min-width:0;height:30px;padding-right:10px;"]),R=m.default.div.withConfig({displayName:"PermissionRow__UserInfoDiv",componentId:"sc-59b63cba-3"})(["display:flex;flex-direction:column;min-width:0;"]),E=m.default.div.withConfig({displayName:"PermissionRow__UserRoleRowRightDiv",componentId:"sc-59b63cba-4"})(["display:flex;align-items:center;flex-shrink:0;"]),T=m.default.div.withConfig({displayName:"PermissionRow__RoleDiv",componentId:"sc-59b63cba-5"})(["flex-grow:1;"]),A=m.default.ul.withConfig({displayName:"PermissionRow__AssetList",componentId:"sc-59b63cba-6"})(["margin:8px 0;padding-left:16px;li{margin-bottom:4px;&:last-child{margin-bottom:0;}}"]),N=u.memo(function(e){let{avatar:n,isOwner:t,label:i,minimal:s=!1,name:a}=e;return(0,l.jsxs)(I,{children:[n,(0,l.jsx)(R,{children:(0,l.jsx)(p.xk,{content:i,disabled:!i,position:"bottom",children:(0,l.jsxs)(p.Dy,{ellipsize:!0,fontSize:s?"small":void 0,children:[a,t&&(0,l.jsxs)(l.Fragment,{children:[" ",(0,l.jsx)(p.Dy,{fontColor:"muted",children:"(Owner)"})]})]})})})]})}),k=u.memo(function(e){var n,t,u,m,h,x;let b,C,{className:I,data:R,isComponent:A=!1,minimal:k=!1,rolePicker:M,unpublishedChanges:L}=e,$=(0,f.O)({safe:!0}),F=null==$?void 0:$.hexType,U=(0,g.i)(),B=F===a.K$B.ASK?"thread":"project";if("user"===R.dataType){let e=null!=(u=R.name)?u:R.email,n=null!=U&&(0,r.qM)(null==U?void 0:U.orgRole,a.XTy.ADMIN);if(null!=R.denialReason)switch(R.denialReason.__typename){case"AssetAccess":b=(0,l.jsx)(P,{action:`cannot access ${B}`,assetAccess:R.denialReason,isCurrentUserAdmin:n,userLabel:e});break;case"MissingProjectRole":break;default:b=`${e} cannot access ${B}.`,(0,o.ew)(R.denialReason,R.denialReason.__typename)}else if(null!=R.appUserReason){let t=(0,l.jsxs)(l.Fragment,{children:["has been downgraded to"," ",(0,l.jsx)("strong",{children:(0,c.f_)(a.Mk2.APP_USER,A)})," ","access"]});switch(R.appUserReason.__typename){case"MissingOrgRole":b=D({userLabel:e,isCurrentUserAdmin:n,downgradedToLabel:t,currentOrgRole:R.appUserReason.currentOrgRole,neededOrgRole:R.appUserReason.neededOrgRole});break;case"MissingProjectRole":break;default:b=(0,l.jsxs)(l.Fragment,{children:[e," ",t,"."]}),(0,o.ew)(R.appUserReason,R.appUserReason.__typename)}}else if(R.role===a.Mk2.VIEWER&&(null==(t=R.viewerReason)?void 0:t.__typename)==="AssetAccess")(F!==a.K$B.ASK||(0,r.qM)(R.orgRole,a.XTy.EXPLORER))&&(b=(0,l.jsx)(P,{action:"cannot explore from app",assetAccess:R.viewerReason,isCurrentUserAdmin:n,userLabel:e}));else if(null!=R.viewerReason){let t=(0,l.jsxs)(l.Fragment,{children:["has been downgraded to"," ",(0,l.jsx)("strong",{children:(0,c.f_)(a.Mk2.VIEWER,A)})," ","access"]});switch(R.viewerReason.__typename){case"AssetAccess":b=(0,l.jsx)(P,{action:t,assetAccess:R.viewerReason,isCurrentUserAdmin:n,userLabel:e});break;case"MissingOrgRole":b=D({userLabel:e,isCurrentUserAdmin:n,downgradedToLabel:t,currentOrgRole:R.viewerReason.currentOrgRole,neededOrgRole:R.viewerReason.neededOrgRole});break;case"OAuthCredsNotShared":b=(0,l.jsxs)(l.Fragment,{children:[e," ",t," due to using an OAuth data connection without shared credentials."," ",(0,l.jsx)(y.c,{to:d.sH.OAuthDataConnections,children:"Learn more."})]});break;case"OAuthCollaborationNonSessionOwner":case"MissingProjectRole":case"NonDraftVersion":case"Archived":case"Trashed":break;default:b=(0,l.jsxs)(l.Fragment,{children:[e," ",t,"."]}),(0,o.ew)(R.viewerReason,R.viewerReason.__typename)}}}let V="user"===R.dataType&&null!=b?(0,l.jsx)(v.id,{intent:i.J.WARNING}):(0,l.jsx)(v.VQ$,{});return L&&R.role===a.Mk2.APP_USER&&(b=b||(C=R.dataType,(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("strong",{children:`This ${B} has unpublished changes.`})," This"," ",C," will only see the latest published version."]}))),(0,l.jsxs)(_,{className:I,children:["user"===R.dataType&&!0!==R.active&&(0,l.jsx)(p.xk,{content:"This user's account has been deactivated.",placement:"top",children:(0,l.jsx)(S,{children:(0,l.jsx)(s.I,{icon:"error",intent:"warning"})})}),"user"===R.dataType?(0,l.jsx)(N,{avatar:(0,l.jsx)(w.H,{active:!0,email:R.email,imageUrl:null!=(m=R.imageUrl)?m:void 0,name:null!=(h=R.name)?h:void 0,size:30}),isOwner:R.isOwner,label:R.email,minimal:k,name:R.name||R.email}):(0,l.jsx)(N,{avatar:(0,l.jsx)(j.eu,{active:!0,altText:R.name,size:30,text:(0,l.jsx)(v.YXz,{})}),label:"",minimal:k,name:R.name}),(0,l.jsxs)(E,{children:[b&&"user"===R.dataType&&(null==(n=R.denialReason)?void 0:n.__typename)==="AssetAccess"?(0,l.jsx)(O,{action:`cannot access ${B}`,assetAccess:R.denialReason,isCurrentUserAdmin:null!=U&&(0,r.qM)(null==U?void 0:U.orgRole,a.XTy.ADMIN),userLabel:null!=(x=R.name)?x:R.email,variant:"icon"}):b?(0,l.jsx)(p.xk,{content:b,interactionKind:"hover",children:V}):null,(0,l.jsx)(T,{children:M})]})]})});function D(e){let{currentOrgRole:n,downgradedToLabel:t,isCurrentUserAdmin:i,neededOrgRole:s,userLabel:a}=e,o=i?(0,l.jsx)(p.P8,{to:x.BV.SETTINGS.getUrl({subView:"users"}),children:"Upgrade"}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(C.P,{})," to upgrade"]});return(0,l.jsxs)(l.Fragment,{children:[a," ",t," as they have the"," ",(0,l.jsx)("strong",{children:(0,r.uW)(n)})," role.",(0,l.jsx)("br",{})," ",o," this user to an"," ",(0,l.jsx)("strong",{children:(0,r.uW)(s)})," role."]})}let P=u.memo(function(e){let{action:n="have been downgraded",assetAccess:t,isCurrentUserAdmin:i=!1,userLabel:s="You"}=e,a=function(e){let n,t,l=e.dataConnectionsMissingAccess.map(e=>e.connectionName),i=e.sharedPackagesMissingAccess.map(e=>e.repoName),s=e.secretsMissingAccess.map(e=>e.name),a=e.syncRepositoriesMissingAccess.map(e=>e.repoName),r=e.filesMissingAccess.map(e=>e.filename),o=[e.hasAccessToSharedDataConnections,e.hasAccessToSharedPackages,e.hasAccessToSharedSecrets,e.hasAccessToSharedSyncRepositories,e.hasAccessToSharedFiles].reduce((e,n)=>n?e:e+1,0);return o>1?(n="assets",t="general"):e.hasAccessToSharedDataConnections?e.hasAccessToSharedPackages?e.hasAccessToSharedSecrets?e.hasAccessToSharedSyncRepositories?(n=e.hasAccessToSharedFiles?"assets":e.filesMissingAccess.length>1?"files":"file",t="general"):(n=e.syncRepositoriesMissingAccess.length>1?"sync repositories":"sync repository",t="integrations"):(n=e.secretsMissingAccess.length>1?"secrets":"secret",t="secrets"):(n=e.sharedPackagesMissingAccess.length>1?"packages":"package",t="integrations"):(n=e.dataConnectionsMissingAccess.length>1?"data connections":"data connection",t="data-sources"),{missingConnections:l,missingPackages:i,missingSecrets:s,missingRepositories:a,missingFiles:r,numberOfAssetTypesMissingAccess:o,assetType:n,subView:t}}(t),r=[{key:"connections",items:a.missingConnections,singular:"Data connection",plural:"Data connections"},{key:"secrets",items:a.missingSecrets,singular:"Secret",plural:"Secrets"},{key:"files",items:a.missingFiles,singular:"File",plural:"Files"},{key:"packages",items:a.missingPackages,singular:"Git package",plural:"Git packages"},{key:"repositories",items:a.missingRepositories,singular:"Sync repository",plural:"Sync repositories"}].filter(e=>e.items.length>0);return(0,l.jsxs)(l.Fragment,{children:[s," ",n," due to missing permissions on shared workspace assets:",(0,l.jsx)(A,{children:r.map(e=>(0,l.jsxs)("li",{children:[(0,l.jsxs)("strong",{children:[(0,b.r)(e.items.length,e.singular,e.plural),":"]})," ",e.items.join(", ")]},e.key))}),i?(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(p.P8,{to:x.BV.SETTINGS.getUrl({subView:a.subView}),children:"Update shared asset permissions"})}):(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(C.P,{})," to grant access."]})]})}),O=u.memo(function(e){let{action:n,assetAccess:t,buttonText:s="Review & request access",iconIntent:a=i.J.WARNING,isCurrentUserAdmin:r,userLabel:o,variant:c="icon"}=e,d=(0,l.jsx)(P,{action:n,assetAccess:t,isCurrentUserAdmin:r,userLabel:o});return"button"===c?(0,l.jsx)(p.xk,{content:d,interactionKind:"hover",children:(0,l.jsx)(h.YE,{intent:i.J.PRIMARY,small:!0,text:s})}):(0,l.jsx)(p.xk,{content:d,interactionKind:"hover",children:(0,l.jsx)(v.id,{intent:a})})})},893273:function(e,n,t){t.d(n,{L:()=>C,g:()=>y}),t(390701);var l=t(295709),i=t(856625),s=t(813181),a=t(881042),r=t(51945),o=t(926246),c=t(975843),d=t(885183),u=t(241099),m=t(99573),p=t(36773),h=t(379282);let g=(0,o.default)(d.u).withConfig({displayName:"RequestAccessDialog__StyledDialog",componentId:"sc-f0d363e6-0"})(["&&{width:520px;max-height:88vh;padding:0;}"]),x=o.default.div.withConfig({displayName:"RequestAccessDialog__Container",componentId:"sc-f0d363e6-1"})(["display:flex;flex-direction:column;gap:20px;height:100%;padding:20px;overflow:auto;"]),f=o.default.div.withConfig({displayName:"RequestAccessDialog__Footer",componentId:"sc-f0d363e6-2"})(["display:flex;justify-content:flex-end;padding:10px;border-top:1px solid ",";"],e=>{let{theme:n}=e;return n.borderColor.MUTED}),b=o.default.div.withConfig({displayName:"RequestAccessDialog__RightActions",componentId:"sc-f0d363e6-3"})(["display:flex;gap:10px;"]),C=r.memo(function(e){let{accessType:n,hexId:t,isAskThread:i=!1,isComponent:a,requestAccessCallback:o}=e,c=(0,r.useCallback)(async e=>{await o(n,e)},[n,o]);return(0,l.jsx)(v,{accessString:`${i?"Can view thread":(0,s.f_)(n,a)} permissions.`,accessedRequestedFor:t,dialogType:"request-project-access",requestAccessCallback:c})}),y=r.memo(function(e){let{orgRole:n,requestAccessCallback:t}=e,i=(0,r.useCallback)(async e=>{await t(n,e)},[n,t]);return(0,l.jsx)(v,{accessString:`the ${(0,a.uW)(n)} role`,dialogType:"request-org-access",requestAccessCallback:i})}),v=r.memo(function(e){var n;let{accessString:t,accessedRequestedFor:s,dialogType:a,requestAccessCallback:d}=e,p=(0,h._k)(),C=(0,o.useTheme)(),{closeDialog:y,isOpen:v}=(0,m.s)(a,s),R=(0,r.useCallback)(()=>y(),[y]),[E,T]=(0,r.useState)(!1),[A,N]=(0,r.useState)(null),k=(0,r.useCallback)(e=>{N(e.target.value)},[]),D=(0,r.useCallback)(async()=>{T(!0);try{await d(A),R(),T(!1)}catch(e){console.error(e),p.show({message:"Your access request could not be submitted. Please try again.",intent:i.J.DANGER}),T(!1)}},[R,A,d,p]);return(0,l.jsxs)(g,{isCloseButtonShown:!0,isOpen:v,title:"Request access",usePortal:!0,onClose:R,children:[(0,l.jsxs)(x,{children:[(0,l.jsxs)("div",{children:["You are requesting"," ",(0,l.jsx)(w,{$_css:C.fontWeight.MEDIUM,children:t})]}),(0,l.jsxs)("div",{children:[(0,l.jsxs)(S,{children:["Message"," ",(0,l.jsx)(_,{$_css2:C.fontColor.MUTED,children:"(optional)"})]}),(0,l.jsx)(u.wt,{fill:!0,maxLength:150,placeholder:"",title:"Message (optional)",value:null!=A?A:void 0,onChange:k}),(0,l.jsx)(I,{children:(0,l.jsx)(j,{count:null!=(n=null==A?void 0:A.length)?n:0,max:150})})]})]}),(0,l.jsx)(f,{children:(0,l.jsxs)(b,{children:[(0,l.jsx)(c.YE,{text:"Cancel",onClick:R}),(0,l.jsx)(c.YE,{intent:i.J.PRIMARY,loading:E,text:"Request access",onClick:D})]})})]})});var j=(0,o.default)(p.w).withConfig({displayName:"RequestAccessDialog___StyledCharacterCountIndicator",componentId:"sc-f0d363e6-4"})({marginTop:5}),w=(0,o.default)("span").withConfig({displayName:"RequestAccessDialog___StyledSpan",componentId:"sc-f0d363e6-5"})(e=>({fontWeight:e.$_css})),_=(0,o.default)("span").withConfig({displayName:"RequestAccessDialog___StyledSpan2",componentId:"sc-f0d363e6-6"})(e=>({color:e.$_css2,fontStyle:"italic"})),S=(0,o.default)("div").withConfig({displayName:"RequestAccessDialog___StyledDiv",componentId:"sc-f0d363e6-7"})({marginBottom:8}),I=(0,o.default)("div").withConfig({displayName:"RequestAccessDialog___StyledDiv2",componentId:"sc-f0d363e6-8"})({width:"100%",display:"flex",justifyContent:"flex-end"})},655681:function(e,n,t){t.d(n,{_:()=>v}),t(390701),t(886587),t(966141),t(432219),t(931609);var l=t(295709),i=t(171155),s=t(314478),a=t(813181),r=t(787161),o=t(51945),c=t(926246),d=t(574488),u=t(712610),m=t(990106),p=t(97947),h=t(558366),g=t(685602),x=t(899778);let f=(0,c.default)(d.YE).withConfig({displayName:"RoleDropdown__RoleButton",componentId:"sc-a66089fc-0"})(["justify-content:space-between;outline:none;",""],e=>{let{small:n}=e;return n&&"padding-right: 3px;"}),b=(0,c.default)(g.DZ).withConfig({displayName:"RoleDropdown__RoleGroupHeader",componentId:"sc-a66089fc-1"})(["display:flex;gap:5px;align-items:center;margin-bottom:8px;padding:8px 0 0 8px;"]),C=(0,c.default)(d.RQ).withConfig({displayName:"RoleDropdown__StyledMenu",componentId:"sc-a66089fc-2"})(["min-width:90px;max-width:290px;padding:7px;.","{margin:7px 8px;}.","{width:100%;}"],i.oru,i.wWS),y=c.default.span.withConfig({displayName:"RoleDropdown__BoldSpan",componentId:"sc-a66089fc-3"})(["color:",";"],e=>{let{theme:n}=e;return n.fontColor.DEFAULT}),v=o.memo(function(e){let{additionalActions:n,canShare:t=!0,className:i,"data-test":c,disabled:g=!1,disabledTooltip:v,isComponent:j,isInCollectionsContext:w,labelPrefix:_,maxRole:S,minRole:I,onSelectRole:R,roleAdditionalActions:E={},selectedRole:T,small:A=!1}=e,N=(0,m.O)({safe:!0}),k=(null==N?void 0:N.hexType)===s.K$B.ASK,[D,,{setFalse:P,toggle:O}]=(0,u.H)(!1),M=a.UV.indexOf(S),L=a.UV.indexOf(I),$=k?[s.Mk2.OWNER,s.Mk2.VIEWER]:a.UV,F=$.filter(e=>$.slice(M,L+1).includes(e)),U=F.filter(e=>e!==s.Mk2.APP_USER),B=F.filter(e=>e===s.Mk2.APP_USER),V=j?"component":"project",q=(0,o.useMemo)(()=>({OWNER:{label:(0,a.f_)(s.Mk2.OWNER,j),description:(0,a.Y5)(s.Mk2.OWNER,j)},EDITOR:{label:(0,a.f_)(s.Mk2.EDITOR,j),description:(0,a.Y5)(s.Mk2.EDITOR,j)},VIEWER:{label:k?"Can view thread":(0,a.f_)(s.Mk2.VIEWER,j),description:k?"Can view thread contents and duplicate":(0,a.Y5)(s.Mk2.VIEWER,j)},APP_USER:{label:(0,a.f_)(s.Mk2.APP_USER,j),description:(0,a.Y5)(s.Mk2.APP_USER,j)},NO_ADDED_GRANT:{label:"No additional access",description:"Collection members and managers will not be granted any additional access."}}),[j,k]),z=(0,o.useMemo)(()=>{if(null==T)return q.NO_ADDED_GRANT.label;let e=q[T].label;return _?(0,l.jsxs)(l.Fragment,{children:[_,(0,l.jsx)(y,{children:e})]}):e},[_,q,T]),G=(0,o.useCallback)(e=>{R(e),P()},[R,P]),W=j?r.sH.ComponentsPermissions:r.sH.Permissions,H=`You do not have the permissions to share this ${V}.`,J=(0,o.useMemo)(()=>{let e=(0,l.jsx)(l.Fragment,{children:U.map((e,n)=>{var i;return(0,l.jsx)(d.xk,{content:H,disabled:t,placement:"right",children:(0,l.jsx)(h.t,{additionalActions:null!=(i=E[e])?i:null,currentRole:T,description:q[e].description,disabled:!t,label:q[e].label,role:e,onSelectRole:G},n)},n)})}),n=(0,l.jsx)(l.Fragment,{children:B.length>0&&B.map((e,n)=>{var i;return(0,l.jsx)(d.xk,{content:v,disabled:t,placement:"right",children:(0,l.jsx)(h.t,{additionalActions:null!=(i=E[e])?i:null,currentRole:T,description:q[e].description,disabled:!t,label:q[e].label,role:e,onSelectRole:G},n)},n)})});return w?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(b,{renderAs:"h1",styleAs:"h5",children:["Collection access"," ",(0,l.jsx)(d.xk,{content:`Additional ${V} level access that all collection managers & members will be granted.`,placement:"bottom",children:(0,l.jsx)(x.mo0,{})})]}),e,n]}):(0,l.jsxs)(l.Fragment,{children:[e,n]})},[B,t,v,H,V,U,E,q,G,T,w]);return(0,l.jsx)(d.HG,{captureDismiss:!0,className:i,content:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(C,{children:[J,w&&(0,l.jsx)(h.t,{currentRole:T,description:q.NO_ADDED_GRANT.description,label:q.NO_ADDED_GRANT.label,role:null,onSelectRole:G}),n]}),(0,l.jsx)(d.EW,{children:(0,l.jsx)(p.c,{to:W,children:"Learn more about permissions"})})]}),isOpen:D,minimal:!0,placement:"bottom-start",rootBoundary:"viewport",onClose:P,children:(0,l.jsx)(d.xk,{content:v,disabled:!v||!g,children:(0,l.jsx)(f,{active:D,"data-test":c,disabled:g,minimal:!0,rightIcon:(0,l.jsx)(x.pcN,{}),small:A,onClick:O,children:z})})})})},332762:function(e,n,t){t.d(n,{JI:()=>c,VJ:()=>o});var l=t(379633),i=t(152487),s=t(12298),a=t(741922);let r={},o=(0,l.J1)`
  query GetHexForShareDialog(
    $hexId: HexId!
    $hexVersionId: HexVersionId!
    $getSharedComponentCount: Boolean!
    $orgId: OrgId!
  ) {
    hexById(hexId: $hexId) {
      id
      allowEmbedding
      allowPublicDuplication
      maxGrantableRole
      canShare
      canEditorsShare
      canAllowEditorsToShare
      canRevokeNotionPreviews
      effectiveRole
      owner {
        id
      }
      grants {
        ...PermissionsListFragment
      }
      publicRoleV2
      organizationRoleV2
      hasNotionPreviews
      isShared
      logicViewIsShared
      org {
        id
        displayName
        resolvedAllowPublicSharing
        allowWorkspaceSharing
        allowParameterizedLinkSharing
        hasCustomAppIcon
        supportUserId
        sharedComponentCount @include(if: $getSharedComponentCount)
      }
      lastPublishedVersion {
        id
        version
        layoutType
        canvasLayout {
          id
          width
          height
        }
      }
      collectionHexLinks: safeCollectionHexLinks {
        id
        ...SafeCollectionHexLinkFragment
      }
    }
    publicOrgDetails(orgId: $orgId) {
      displayName
      memberCount
    }
  }
  ${i.F1}
  ${s.Ny}
`;function c(e){let n={...r,...e};return a.I(o,n)}},853534:function(e,n,t){t.d(n,{v:()=>f});var l=t(295709),i=t(171155),s=t(51945),a=t(926246),r=t(574488),o=t(277170);let c=a.default.div.withConfig({displayName:"WiderSharingOption__Container",componentId:"sc-ba6bd0ff-0"})(["display:flex;gap:8px;align-items:center;justify-content:space-between;min-width:0;padding:6px 16px;"]),d=a.default.div.withConfig({displayName:"WiderSharingOption__InfoContainer",componentId:"sc-ba6bd0ff-1"})(["display:flex;flex:1 1 auto;align-items:center;min-width:0;gap:8px;"]),u=a.default.div.withConfig({displayName:"WiderSharingOption__InfoTitleDescriptionContainer",componentId:"sc-ba6bd0ff-2"})(["display:flex;flex-direction:column;min-width:0;color:",";"],e=>{let{theme:n}=e;return n.fontColor.DEFAULT}),m=a.default.div.withConfig({displayName:"WiderSharingOption__InfoDescription",componentId:"sc-ba6bd0ff-3"})(["color:",";font-size:",";line-height:16px;"],e=>{let{theme:n}=e;return n.fontColor.MUTED},e=>{let{theme:n}=e;return n.fontSize.SMALL}),p=a.default.div.withConfig({displayName:"WiderSharingOption__StatusContainer",componentId:"sc-ba6bd0ff-4"})(["display:flex;flex:none;gap:8px;align-items:center;"]),h=a.default.div.withConfig({displayName:"WiderSharingOption__StatusText",componentId:"sc-ba6bd0ff-5"})(["display:flex;align-items:center;color:",";font-size:",";"],e=>{let{theme:n}=e;return n.fontColor.MUTED},e=>{let{theme:n}=e;return n.fontSize.SMALL}),g=a.default.div.withConfig({displayName:"WiderSharingOption__RoleContainer",componentId:"sc-ba6bd0ff-6"})(["margin-left:5px;border-radius:",";box-shadow:inset 0 0 0 1px ",";"," > div{border-left:none;}"],e=>{let{theme:n}=e;return n.borderRadius},e=>{let{theme:n}=e;return n.borderColor.DEFAULT},e=>{let{$subtle:n}=e;return n&&`
        box-shadow: none;
    `}),x=a.default.div.withConfig({displayName:"WiderSharingOption__ToggleContainer",componentId:"sc-ba6bd0ff-7"})(["display:flex;width:28px;"]),f=(0,o.v)(function(e){let{$subtle:n,"data-test":t,disabled:a=!1,disabledMessage:o,enabled:f,icon:b,label:C,onEnabledToggle:y,rolePicker:v,title:j,titleIcon:w,tooltipContent:_}=e,S=(0,s.useCallback)(e=>{y(e.currentTarget.checked)},[y]);return(0,l.jsxs)(c,{children:[(0,l.jsxs)(d,{children:[b,(0,l.jsxs)(u,{children:[(0,l.jsx)(r.xk,{content:_,disabled:!_,children:(0,l.jsx)("div",{className:i.HL_,title:j,children:j})}),C&&(0,l.jsx)(m,{children:C})]}),w]}),(0,l.jsxs)(p,{children:[(0,l.jsx)(h,{children:f?(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(g,{$subtle:n,children:v})}):null}),(0,l.jsx)(x,{children:(0,l.jsx)(r.xk,{content:null!=o?o:"",disabled:!o,children:(0,l.jsx)(r.c2,{checked:f,"data-test":t,disabled:a,inline:!0,onChange:S})})})]})]})})},351959:function(e,n,t){t.d(n,{N3:()=>g,O9:()=>u,_d:()=>c,ah:()=>h,jH:()=>m,l3:()=>d,mh:()=>p});var l,i=t(295709),s=t(51945),a=t(760719),r=t(831230),o=t(899778);let c=341,d=400,u=48,m=600,p=1200;var h=((l={}).DATA_CONNECTIONS="data-connections",l.ENVIRONMENT="environment",l.FILES="files",l.HISTORY="history",l.LEARN="learn",l.SCHEDULED_RUNS="scheduled-runs",l.SEARCH="search",l.TOC="toc",l.VARIABLES="variables",l);let g=()=>(0,s.useMemo)(()=>({toc:{icon:(0,i.jsx)(o.ya_,{}),slug:"toc",title:"Table of contents",dataTest:r.TF.OUTLINE_TAB,counterEvent:"sidebar.click_tab.toc"},search:{icon:(0,i.jsx)(o.fAK,{}),slug:"search",title:"Find",counterEvent:"sidebar.click_tab.search"},"data-connections":{icon:(0,i.jsx)(o.awC,{}),slug:"data-connections",dataTest:r.TF.DATA_CONNECTION_TAB,title:a.w.dataBrowserText,counterEvent:"sidebar.click_tab.data_browser"},environment:{icon:(0,i.jsx)(o.bwb,{}),slug:"environment",title:"Environment",counterEvent:"sidebar.click_tab.environment"},files:{icon:(0,i.jsx)(o.z3t,{}),slug:"files",title:"Files",counterEvent:"sidebar.click_tab.files"},variables:{icon:(0,i.jsx)(o.DyX,{}),slug:"variables",dataTest:r.TF.VARIABLES_TAB,title:"Variables",counterEvent:"sidebar.click_tab.variables"},"scheduled-runs":{icon:(0,i.jsx)(o.XKI,{}),slug:"scheduled-runs",title:"Scheduled runs",dataTest:r.TF.SCHEDULED_RUNS_SIDEBAR_TAB,counterEvent:"sidebar.click_tab.scheduled_runs"},history:{icon:(0,i.jsx)(o.osr,{}),slug:"history",dataTest:r.TF.VERSION_TAB,title:"History & versions",counterEvent:"sidebar.click_tab.history_versions"},learn:{icon:(0,i.jsx)(o.NTw,{}),slug:"learn",title:"Help & support",location:"bottom-lower",dataTest:r.TF.HELP_AND_SUPPORT,counterEvent:"sidebar.click_tab.help"}}),[])},923362:function(e,n,t){t.d(n,{E:()=>a,M:()=>r});var l=t(295709);t(51945);var i=t(899778),s=t(732037);let a={All:{display:"All",label:"all",icon:(0,l.jsx)(i.Ysf,{}),counterEvent:"sidebar.outline.filter.all"},Code:{display:"Python",label:"Python",typename:"CodeCell",icon:(0,l.jsx)(s.Ze,{}),counterEvent:"sidebar.outline.filter.code"},Components:{display:"Components",label:"Components",typename:"ComponentImportCell",icon:(0,l.jsx)(i.VEy,{}),counterEvent:"sidebar.outline.filter.components"},Input:{display:"Inputs",label:"Inputs",typename:"Parameter",icon:(0,l.jsx)(s.dE,{}),counterEvent:"sidebar.outline.filter.inputs"},Sections:{display:"Sections",label:"Sections",typename:"CollapsibleCell",icon:(0,l.jsx)(s.DN,{}),counterEvent:"sidebar.outline.filter.sections"},Sql:{display:"SQL",label:"SQL",typename:"SqlCell",icon:(0,l.jsx)(s.Ch,{}),counterEvent:"sidebar.outline.filter.sql"},Text:{display:"Text",label:"Text",typename:["MarkdownCell","TextCell"],icon:(0,l.jsx)(s.Bf,{}),counterEvent:"sidebar.outline.filter.text"},Transformations:{display:"Transformations",label:"Transformations",typename:["FilterCell","PivotCell"],icon:(0,l.jsx)(s.yH,{}),counterEvent:"sidebar.outline.filter.transformations"},Visualizations:{display:"Visualizations",label:"Visualizations",typename:["ChartCell","DisplayTableCell","MetricCell","MapCell"],icon:(0,l.jsx)(s.e9,{}),counterEvent:"sidebar.outline.filter.visualizations"},Writeback:{display:"Writeback",label:"Writeback",typename:["WritebackCell"],icon:(0,l.jsx)(s.fk,{}),counterEvent:"sidebar.outline.filter.writeback"}};function r(e,n){if("ExploreCell"!==e.__typename)return!1;let{visualizationType:t}=e.spec;switch(n){case"Transformations":return"pivot-table"===t;case"Visualizations":return!0;default:return!1}}},365066:function(e,n,t){t.d(n,{p:()=>s});var l=t(379633),i=t(552233);let s=(0,l.J1)`
  fragment TableListFragment on DataSourceTable {
    id
    name
    comment
    columnCount
    dataConnectionId
    tableType
    metadata {
      id
      magicDescription
      status {
        ...StatusFragment
      }
      categories {
        ...CategoryFragment
      }
    }
    dbtDescriptionMdStripped
    dataSourceSchema {
      id
      name
      dataSourceDatabase {
        id
        name
      }
    }
    pinned
    pinnedAt
  }
  ${i.B}
  ${i.$}
`},755142:function(e,n,t){t.d(n,{F6:()=>m,Hn:()=>c,KP:()=>o,YQ:()=>h,dE:()=>x,gJ:()=>b,hL:()=>g,hx:()=>u,y0:()=>p});var l=t(379633),i=t(365066),s=t(552233),a=t(741922);let r={},o=(0,l.J1)`
  fragment PinnedSchemaFragment on DataSourceSchema {
    id
    pinned
    pinnedAt
    name
    dataConnectionId
    metadata {
      id
      magicDescription
      status {
        ...StatusFragment
      }
      categories {
        ...CategoryFragment
      }
    }
    dataSourceDatabase {
      id
      name
    }
    tableCount
  }
  ${s.B}
  ${s.$}
`,c=(0,l.J1)`
  fragment PinnedSemanticDatasetFragment on SemanticDataset {
    id
    pinned
    pinnedAt
    name
    title
    status {
      id
    }
    description
    categories {
      id
    }
    semanticProject {
      id
      name
      dataConnection {
        id
      }
    }
  }
`,d=(0,l.J1)`
  fragment PinnedSemanticViewFragment on SemanticView {
    id
    pinned
    pinnedAt
    name
    title
    description
    status {
      id
    }
    categories {
      id
    }
    semanticProject {
      id
      name
      dataConnection {
        id
      }
    }
  }
`,u=(0,l.J1)`
  query PinnedTables($hexId: HexId) {
    me {
      id
      pinnedTables(hexId: $hexId) {
        id
        ...TableListFragment
      }
    }
  }
  ${i.p}
`;function m(e){let n={...r,...e};return a.I(u,n)}let p=(0,l.J1)`
  query PinnedSchemas($hexId: HexId) {
    me {
      id
      pinnedSchemas(hexId: $hexId) {
        id
        ...PinnedSchemaFragment
      }
    }
  }
  ${o}
`;function h(e){let n={...r,...e};return a.I(p,n)}let g=(0,l.J1)`
  query PinnedSemanticDatasets {
    me {
      id
      pinnedSemanticDatasets {
        id
        ...PinnedSemanticDatasetFragment
      }
    }
  }
  ${c}
`;function x(e){let n={...r,...e};return a.I(g,n)}let f=(0,l.J1)`
  query PinnedSemanticViews {
    me {
      id
      pinnedSemanticViews {
        id
        ...PinnedSemanticViewFragment
      }
    }
  }
  ${d}
`;function b(e){let n={...r,...e};return a.I(f,n)}},692942:function(e,n,t){t.d(n,{Eu:()=>a,Nz:()=>d,QZ:()=>r,Zu:()=>m,h8:()=>o,iz:()=>u,xh:()=>c}),t(226940);var l,i=t(295709),s=t(314478);t(51945);var a=((l={}).NAME="Name",l.LAST_MODIFIED="Last modified",l.SIZE="Size",l);let r=["csv","pkl","xls","xlsx","json","parquet"],o=["csv"],c=["csv","tsv","parquet"],d=e=>{let n=(e.substring(0,e.lastIndexOf("."))||e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_]/g,"_");return/^[0-9]/.test(n)?"df_"+n:n},u=async e=>{var n;let{filename:t,language:l,toaster:a}=e,r=null!=(n=((e,n)=>{let t=e.split(".").pop(),l=n===s.w1P.PYTHON,i=d(e);switch(t){case"csv":return l?`${i} = pd.read_csv("${e}")`:`${i} = read_csv("${e}")`;case"pkl":return l?`${i} = pd.read_pkl("${e}")`:null;case"xlsx":case"xls":return l?`${i} = pd.read_excel("${e}")`:null;case"json":return l?`${i} = pd.read_json("${e}")`:null;case"parquet":return l?`${i} = pd.read_parquet("${e}")`:null;default:return null}})(t,l))?n:"Unable to copy dataframe creation code.";await navigator.clipboard.writeText(r),a.show({message:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("strong",{children:"Code snippet"})," copied to clipboard."]}),timeout:2500})},m=async e=>{let{filename:n,toaster:t}=e;await navigator.clipboard.writeText(n),t.show({message:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("strong",{children:"File name"})," copied to clipboard."]}),timeout:2500})}},653610:function(e,n,t){t.d(n,{Wq:()=>r,cX:()=>a,um:()=>o}),t(886587),t(931609),t(226940),t(966141),t(21430),t(390701),t(645976);var l=t(917510),i=t(227368),s=t(265437);function a(e){let{caseMatch:n,exactWordMatch:t,replaceString:a,replaceWith:r,richTextDoc:o}=e,c=new RegExp((0,s.YR)(a,t),n?"g":"gi");return o.map(e=>({...e,children:function e(n,t,s){return s.map(s=>{if(l.c3.guard(s))return{...s,text:s.text.replace(n,t)};if(l.K9.guard(s)){var a;let l=(null!=(a=e(n,t,s.children))?a:[]).filter(i.z);return{...s,children:l}}return s})}(c,r,e.children)}))}function r(e){let n=[];return e.forEach((e,t)=>{!function e(n,t,i){return l.c3.guard(n)?void t.push({lineSource:n.text,richTextElementPath:[...i]}):l.K9.guard(n)?void n.children.forEach((n,l)=>{e(n,t,[...i,l])}):void 0}(e,n,[t])}),n}function o(e,n,t){let{cellType:i,lineIndex:a,match:r,richTextElementPath:o,type:c}=e,d="richText"in n?n.richText:null;if((null==o?void 0:o.length)==null||null==d||null==a||null==r)return null;let u=d.map((e,n)=>n===o[0]?{...e,...function e(n){let{depth:t,match:i,node:s,path:a,replaceString:r}=n;if(t===a.length){if(l.c3.guard(s)){let e=s.text,n=e.substring(0,i.startIndex)+r+e.substring(i.endIndex);return{...s,text:n}}}else if(l.K9.guard(s)&&s.children.length>a[t]){let n=a[t],l=s.children.map((l,s)=>s===n?e({node:l,path:a,depth:t+1,match:i,replaceString:r}):l);return{...s,children:l}}return s}({node:e,path:o,depth:1,match:r,replaceString:t})}:e),m=s.Yx[i];if(m&&m[c]){var p,h,g;return null!=(g=null==(p=(h=m[c]).updateCellContents)?void 0:p.call(h,{cellContents:n,cellId:e.cellId,nextSource:null,nextRichText:u}))?g:null}return null}},265437:function(e,n,t){t.d(n,{BG:()=>b,E7:()=>d,Oe:()=>m,Qn:()=>c,YR:()=>f,Yb:()=>x,Yx:()=>g,a9:()=>v,cI:()=>C,dQ:()=>p,jW:()=>y,w4:()=>h,z9:()=>u}),t(226940),t(347052),t(21430);var l=t(20286),i=t(518640),s=t(313486),a=t(19746),r=t(927183),o=t(653610);let c="gmi",d="gm";(0,r.Union)((0,r.Literal)("PROJECT_DESCRIPTION"),(0,r.Literal)("PROJECT_TITLE"),(0,r.Literal)("CELL_LINE"),(0,r.Literal)("CELL_RICH_TEXT_ELEMENT"),(0,r.Literal)("CELL_OUTPUT"),(0,r.Literal)("CELL_INPUT"),(0,r.Literal)("CELL_LABEL"),(0,r.Literal)("CELL_ID"));let u=250;function m(e){if(null!=e.cellType&&!e.hasParentComponent){var n,t,l;return null!=(l=null==(t=g[e.cellType])||null==(n=t[e.type])?void 0:n.updateCellContents)?l:null}return null}function p(e){return`${e.cellId}-${e.type}`}let h="NO_OP_MP_OPERATION",g={CODE:{CELL_LINE:{updateCellContents:e=>{let{cellContents:n,cellId:t,nextSource:i}=e;return"CodeCell"===n.__typename&&null!=i?l.Z.create({key:"source",value:i,cellId:t,codeCellId:n.codeCellId}):null}}},SQL:{CELL_LINE:{updateCellContents:e=>{let{cellContents:n,cellId:t,nextSource:l}=e;return"SqlCell"===n.__typename&&null!=l?i.o.create({key:"source",value:l,cellId:t,sqlCellId:n.sqlCellId}):null}}},MARKDOWN:{CELL_LINE:{updateCellContents:e=>{let{cellContents:n,cellId:t,nextSource:l}=e;return"MarkdownCell"===n.__typename&&null!=l?s.N.create({key:"source",value:l,cellId:t,markdownCellId:n.markdownCellId}):null}}},TEXT:{CELL_RICH_TEXT_ELEMENT:{updateCellContents:e=>{let{cellContents:n,cellId:t,nextRichText:l}=e;return"TextCell"===n.__typename&&null!=l?a.h.create({key:"richText",value:l,cellId:t,textCellId:n.textCellId}):null}}}};function x(e){return e.split(/\r?\n/)}function f(e,n){let t=e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return n?`\\b${t}\\b`:t}let b=e=>e.cellType?e.cellType:"ProjectMatch";function C(e,n,t){return null==m(e)?null:"source"in n?function(e,n,t){if(!m(e)||null==e.lineIndex||null==e.match||!("source"in n))return null;let l=x(n.source);if(l.length<=e.lineIndex)return null;let i=l[e.lineIndex];l[e.lineIndex]=i.substring(0,e.match.startIndex)+t+i.substring(e.match.endIndex);let s=g[e.cellType];if(s&&s[e.type]){let t=s[e.type];if(t){var a,r;return null!=(r=null==(a=t.updateCellContents)?void 0:a.call(t,{cellContents:n,cellId:e.cellId,nextSource:l.join("\n"),nextRichText:null}))?r:null}}return null}(e,n,t):"richText"in n&&null!=e.richTextElementPath?(0,o.um)(e,n,t):null}function y(e){let{caseMatch:n,cellContents:t,cellItem:l,exactWordMatch:i,replaceString:s,replaceWith:a}=e,r=m(l),u="source"in t?t.source:null,p="richText"in t?t.richText:null;return null!=p&&r?r({cellContents:t,cellId:l.cellId,nextRichText:(0,o.cX)({richTextDoc:p,replaceString:s,replaceWith:a,caseMatch:n,exactWordMatch:i}),nextSource:null}):null!=u&&r?r({cellContents:t,cellId:l.cellId,nextSource:function(e){let{caseMatch:n,currentSubstring:t,exactWordMatch:l,replaceWith:i,sourceString:s}=e,a=new RegExp(f(t,l),n?d:c);return s.replace(a,i)}({sourceString:u,currentSubstring:s,replaceWith:a,caseMatch:n,exactWordMatch:i}),nextRichText:null}):null}let v=e=>{let{caseMatch:n,exactWordMatch:t,searchTerm:l,searchableItem:i}=e;if(""===l)return{results:[],hasMore:!1,error:!1};try{let e,s=f(l,t),a=new RegExp(s,n?d:c),r=[];for(;null!=(e=a.exec(i))&&r.length<u;)a.lastIndex===e.index&&a.lastIndex++,r.push({start:e.index,end:e.index+l.length});return{results:r,hasMore:r.length>=u,error:!1}}catch(e){return console.error(e),{results:[],hasMore:!1,error:!0}}}},878168:function(e,n,t){t.d(n,{Mj:()=>s,Nj:()=>o,fl:()=>a,gz:()=>r});var l=t(712019),i=t(926246);let s=i.default.div.withConfig({displayName:"sidebarSharedStyles__SidebarDivider",componentId:"sc-c48c22d2-0"})(["flex:none;width:100%;height:1px;background:",";"],e=>{let{theme:n}=e;return n.borderColor.MUTED}),a=16,r=6,o=i.default.div.withConfig({displayName:"sidebarSharedStyles__AppSidebarContainer",componentId:"sc-c48c22d2-2"})(["display:flex;flex:none;flex-direction:column;height:100%;"," @media (max-width:","){width:100%;}"],e=>{let{$showBorder:n,theme:t}=e;return n&&(0,i.css)(["width:300px;background:",";border-left:1px solid ",";"],t.backgroundColor.DEFAULT,(0,l.B3)(t.borderColor.DEFAULT,.5))},e=>{let{theme:n}=e;return`${n.mediaQuery.EXTRA_SMALL}px`})}}]);
//# sourceMappingURL=1b2e60e7c5d6d88b.contentHashV1.bundle.js.map