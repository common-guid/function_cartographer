"use strict";(self.webpackChunk_hex_client=self.webpackChunk_hex_client||[]).push([["66509"],{400286:function(e,n,t){t.d(n,{Mj:()=>u,uq:()=>s});var o=t(379633),i=t(985584),a=t(741922);let l={},r=(0,o.J1)`
  fragment ListBigQueryOAuthConnectionFragment on BigQueryOAuthConnection {
    id
    name
    hasToken
    projectId
    clientId
    orgId
    linkedDataConnections {
      id
      ...LinkedDataConnectionsFragment
    }
  }
  ${i.RW}
`,s=(0,o.J1)`
  query ListBigQueryOAuthConnectionForConnectionList($orgId: OrgId!) {
    listBigQueryOAuthConnection(orgId: $orgId) {
      id
      ...ListBigQueryOAuthConnectionFragment
    }
  }
  ${r}
`;function u(e){let n={...l,...e};return a.I(s,n)}},658146:function(e,n,t){t.d(n,{W:()=>l});var o=t(314478),i=t(51945),a=t(735153);let l=()=>{let e=(0,a.k)();return{authenticate:(0,i.useCallback)(async n=>{await e({bigQueryOAuthConnectionId:n,tokenAttribution:o.AgC.USER})},[e])}}},354250:function(e,n,t){t.d(n,{qi:()=>s,yW:()=>u});var o=t(379633),i=t(985584),a=t(741922);let l={},r=(0,o.J1)`
  fragment ListDatabricksOAuthConnectionFragment on DatabricksOAuthConnection {
    id
    name
    hasToken
    expired
    host
    clientId
    orgId
    linkedDataConnections {
      id
      ...LinkedDataConnectionsFragment
    }
  }
  ${i.RW}
`,s=(0,o.J1)`
  query ListDatabricksOAuthConnectionForConnectionList($orgId: OrgId!) {
    listDatabricksOAuthConnection(orgId: $orgId) {
      id
      ...ListDatabricksOAuthConnectionFragment
    }
  }
  ${r}
`;function u(e){let n={...l,...e};return a.I(s,n)}},431044:function(e,n,t){t.d(n,{U:()=>l});var o=t(314478),i=t(51945),a=t(215848);let l=()=>{let e=(0,a.i)();return{authenticate:(0,i.useCallback)(async n=>{await e({databricksOAuthConnectionId:n,tokenAttribution:o.AgC.USER})},[e])}}},985584:function(e,n,t){t.d(n,{RW:()=>l,Wl:()=>u,s$:()=>s});var o=t(379633),i=t(741922);let a={},l=(0,o.J1)`
  fragment LinkedDataConnectionsFragment on DataConnection {
    id
    connectionName
  }
`,r=(0,o.J1)`
  fragment ListSnowflakeOAuthConnectionFragment on SnowflakeOAuthConnection {
    id
    name
    hasToken
    refreshTokenExpires
    accountId
    isProxy
    clientId
    snowflakeRole
    orgId
    authWithSso
    ssoAuthServerAttribute
    linkedDataConnections {
      id
      ...LinkedDataConnectionsFragment
    }
  }
  ${l}
`,s=(0,o.J1)`
  query ListSnowflakeOAuthConnectionForConnectionList($orgId: OrgId!) {
    listSnowflakeOAuthConnection(orgId: $orgId) {
      id
      ...ListSnowflakeOAuthConnectionFragment
    }
  }
  ${r}
`;function u(e){let n={...a,...e};return i.I(s,n)}},509666:function(e,n,t){t.d(n,{m:()=>c});var o=t(295709),i=t(379633),a=t(295268),l=t(856625),r=t(51945),s=t(379282);let u=(0,i.J1)`
  query getSnowflakeOAuthConnectionDetailsWithAuthorizeUrl(
    $dataConnectionId: DataConnectionId
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
    $role: String
    $tokenAttribution: OAuthTokenAttribution
  ) {
    getSnowflakeOAuthConnectionDetailsWithAuthorizeUrl(
      dataConnectionId: $dataConnectionId
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
      tokenAttribution: $tokenAttribution
      role: $role
    ) {
      authorizeUrl
    }
  }
`;function c(){let e=(0,a.m)(),n=(0,s._k)(),t=(0,r.useCallback)(()=>{n.show({message:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("strong",{children:"Failed to authorize with Snowflake."})," Please try again, or reach out to support@targetsite.com if the problem persists."]}),intent:l.J.DANGER,timeout:5e3})},[n]);return(0,r.useCallback)(async n=>{let{dataConnectionId:o,snowflakeOAuthConnectionId:i,snowflakeRole:a,tokenAttribution:l}=n,{data:r}=await e.query({query:u,variables:{dataConnectionId:null!=o?o:null,snowflakeOAuthConnectionId:i,role:""!==a?a:null,tokenAttribution:null!=l?l:null}});if(null==r)return void t();let{authorizeUrl:s}=r.getSnowflakeOAuthConnectionDetailsWithAuthorizeUrl;window.open(s)},[e,t])}(0,i.J1)`
  query getSnowflakeOAuthConnectionDetailsWithAuthorizeUrl(
    $dataConnectionId: DataConnectionId
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
    $role: String
    $tokenAttribution: OAuthTokenAttribution
  ) {
    getSnowflakeOAuthConnectionDetailsWithAuthorizeUrl(
      dataConnectionId: $dataConnectionId
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
      tokenAttribution: $tokenAttribution
      role: $role
    ) {
      authorizeUrl
    }
  }
`},310255:function(e,n,t){t.d(n,{pc:()=>r,r0:()=>s,zb:()=>c});var o=t(379633),i=t(868828),a=t(507911);let l={},r=(0,o.J1)`
  query UserSnowflakeOAuthConnectionsForRefreshDialog(
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
  ) {
    userSnowflakeOAuthConnectionsForConnection(
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
    ) {
      id
      role
    }
  }
`;function s(e){let n={...l,...e};return i._(r,n)}let u=(0,o.J1)`
  mutation SetSnowflakeOAuthRolePreference(
    $role: String!
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
    $dataConnectionId: DataConnectionId!
  ) {
    setSnowflakeOAuthRolePreference(
      role: $role
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
      dataConnectionId: $dataConnectionId
    ) {
      id
      role
    }
  }
`;function c(e){let n={...l,...e};return a.n(u,n)}},798388:function(e,n,t){t.d(n,{o:()=>$}),t(390701),t(974102),t(73952),t(808489),t(728256),t(200431),t(728388),t(121502),t(218505),t(761683),t(733885),t(533915),t(791060),t(474597),t(515183),t(518528),t(803743),t(877254),t(790642),t(635498),t(820660),t(139538),t(622439),t(210259),t(886587),t(931609);var o=t(295709),i=t(379633),a=t(295268),l=t(856625),r=t(263771),s=t(171155),u=t(51945),c=t(926246),d=t(574488),h=t(712610),f=t(90210),C=t(379282),k=t(965785),w=t(899778),A=t(185499),g=t(985584),S=t(509666),O=t(310255);(0,i.J1)`
  query UserSnowflakeOAuthConnectionsForRefreshDialog(
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
  ) {
    userSnowflakeOAuthConnectionsForConnection(
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
    ) {
      id
      role
    }
  }
`,(0,i.J1)`
  mutation SetSnowflakeOAuthRolePreference(
    $role: String!
    $snowflakeOAuthConnectionId: SnowflakeOAuthConnectionId!
    $dataConnectionId: DataConnectionId!
  ) {
    setSnowflakeOAuthRolePreference(
      role: $role
      snowflakeOAuthConnectionId: $snowflakeOAuthConnectionId
      dataConnectionId: $dataConnectionId
    ) {
      id
      role
    }
  }
`;let I=(0,c.default)(d.uV).withConfig({displayName:"useSnowflakeOAuthRefreshDialog__StyledDialog",componentId:"sc-9abb223-0"})(["width:300px;"]),m=(0,c.default)(d.HG).withConfig({displayName:"useSnowflakeOAuthRefreshDialog__SwitchRolePopover",componentId:"sc-9abb223-1"})(["width:100%;"]),b=(0,c.default)(d.YE).withConfig({displayName:"useSnowflakeOAuthRefreshDialog__SwitchRoleButton",componentId:"sc-9abb223-2"})(["justify-content:space-between;width:100%;"]),p=(0,c.default)(d.RQ).withConfig({displayName:"useSnowflakeOAuthRefreshDialog__SwitchRoleMenu",componentId:"sc-9abb223-3"})(["min-width:","px;"],270),y=(0,c.default)(d.C9).withConfig({displayName:"useSnowflakeOAuthRefreshDialog__SwitchRoleMenuItem",componentId:"sc-9abb223-4"})(["font-size:",";"],e=>{let{theme:n}=e;return n.fontSize.SMALL}),R=c.default.div.withConfig({displayName:"useSnowflakeOAuthRefreshDialog__FooterContainer",componentId:"sc-9abb223-5"})(["display:flex;flex-direction:row;gap:10px;"]),D=c.default.div.withConfig({displayName:"useSnowflakeOAuthRefreshDialog__ConnectionNameLabel",componentId:"sc-9abb223-6"})(["font-weight:",";"],e=>{let{theme:n}=e;return n.fontWeight.MEDIUM}),$=e=>{let{roleRestriction:n}=e,[t,i]=(0,u.useState)("addRole"),[c,$]=(0,u.useState)(!1),[v,x]=(0,u.useState)(null),[E,F]=(0,u.useState)(void 0),_=(0,C._k)(),[L,j]=(0,u.useState)(n),[T,U]=(0,u.useState)(void 0),N=(0,S.m)(),J=(0,u.useCallback)(async()=>{null!=v?(await N({snowflakeOAuthConnectionId:v,snowflakeRole:L,dataConnectionId:T}),$(!1)):_.show({message:"Failed to authenticate with Snowflake. Please reach out to support@targetsite.com if the problem persists",intent:l.J.DANGER,timeout:5e3})},[v,N,L,T,_]),[z,P]=(0,u.useState)(!1),[B,W]=(0,u.useState)(new Set),[q,M]=(0,u.useState)(null),[Q,G,{setFalse:Y,setTrue:H}]=(0,h.H)(!1),[V]=(0,O.r0)(),[X]=(0,O.zb)(),K=(0,a.m)(),Z=(0,u.useCallback)(async()=>{null!=q&&null!=v&&null!=T?(await X({variables:{role:q,snowflakeOAuthConnectionId:v,dataConnectionId:T},update:(e,n)=>{let{data:t}=n;(null==t?void 0:t.setSnowflakeOAuthRolePreference)&&e.modify({id:e.identify({__typename:"DataConnection",id:T}),fields:{passthroughOAuthInfo:e=>({...e,currentRole:t.setSnowflakeOAuthRolePreference.role})}})},onCompleted:async e=>{await K.refetchQueries({include:[g.s$,A.pG,k.wJ]})}}),$(!1)):_.show({message:"Failed to switch Snowflake role. Please reach out to support@targetsite.com if the problem persists",intent:l.J.DANGER,timeout:5e3})},[v,K,T,X,q,_]),ee=(0,u.useCallback)(async e=>{let{dataConnectionId:t,dataConnectionName:o,prefilledRole:a,snowflakeOAuthConnectionId:r,variant:s}=e;if(x(r),U(t),F(o),"switchRole"===s){if(!t)return void _.show({message:"Error opening switch Snowflake role dialog. Please reach out to support@targetsite.com if the problem persists",intent:l.J.DANGER,timeout:5e3});i(s),P(!0),await V({variables:{snowflakeOAuthConnectionId:r}}).then(e=>{var n,t;let{data:o}=e,i=new Set(null!=(n=null==o?void 0:o.userSnowflakeOAuthConnectionsForConnection.map(e=>{var n;return null!=(n=e.role)?n:"Default"}))?n:[]);W(i),M(a&&i.has(a)?a:null!=(t=i.values().next().value)?t:null),P(!1)})}else n?j(n):j(null!=a?a:null);$(!0)},[V,n,_]);return{dialog:(0,u.useMemo)(()=>{let e="Authenticate with Snowflake",a=(0,o.jsxs)("form",{onSubmit:J,children:[E&&(0,o.jsx)(r.g,{label:"Data connection",style:{marginBottom:15},children:(0,o.jsx)(D,{children:E})}),(0,o.jsx)(r.g,{label:n?"Snowflake role":"Snowflake role (leave blank to use default)",subLabel:n?`An admin has restricted usage of this data connection to users with the Snowflake role ${n}`:void 0,children:(0,o.jsx)(d.Jy,{disabled:!!n,fill:!0,onChange:e=>j(e.currentTarget.value),value:null!=L?L:"",onKeyPress:e=>{e.key===f.D$.ENTER&&(e.preventDefault(),J())}})})]}),u=(0,o.jsx)(d.YE,{intent:l.J.SUCCESS,onClick:J,children:"Refresh token"});return"switchRole"!==t||n||(e="Switch Snowflake role",a=(0,o.jsx)(o.Fragment,{children:z?(0,o.jsx)(d.L2,{}):(0,o.jsx)("form",{onSubmit:J,children:(0,o.jsx)(r.g,{label:"Choose role",style:{margin:0},subLabel:"Choose one of available Snowflake roles, or authenticate with a new role",children:(0,o.jsx)(m,{content:(0,o.jsx)(p,{children:Array.from(B).sort().map(e=>(0,o.jsx)(y,{onClick:()=>M(e),text:e,disabled:e===q},e))}),isOpen:Q,minimal:!0,placement:"bottom-start",onClose:Y,children:(0,o.jsx)(b,{disabled:0===B.size,rightIcon:(0,o.jsx)(w.pcN,{}),onClick:H,children:B.size>0?null!=q?q:"Choose role":"No available roles"})})})})}),u=(0,o.jsxs)(R,{children:[(0,o.jsx)(d.YE,{disabled:0===B.size,intent:l.J.SUCCESS,onClick:Z,children:"Switch role"}),(0,o.jsx)(d.YE,{intent:l.J.NONE,onClick:()=>i("addRole"),children:"Add new role"})]})),(0,o.jsx)("div",{onClick:e=>e.stopPropagation(),children:(0,o.jsxs)(I,{isCloseButtonShown:!0,isOpen:c,title:e,onClose:()=>$(!1),children:[(0,o.jsx)("div",{className:s.sar,children:a}),(0,o.jsx)("div",{className:s.DBf,children:u})]})})},[E,n,L,J,t,c,z,B,Q,Y,H,q,Z]),open:ee}}},406185:function(e,n,t){t.d(n,{q:()=>c}),t(212556);var o=t(295709),i=t(696829);t(51945);var a=t(237376),l=t(826511),r=t(658146),s=t(431044),u=t(798388);let c=e=>{let{dataConnectionType:n,roleRestriction:t}=e,c=(0,u.o)({roleRestriction:t}),{authenticate:d}=(0,r.W)(),{authenticate:h}=(0,s.U)();if(null==n)return{dialog:(0,o.jsx)(o.Fragment,{}),open:()=>{},authenticate:void 0};switch(n){case i.Uz.snowflake:return{dialog:c.dialog,open:e=>{let{authWithSso:n,dataConnectionId:t,dataConnectionName:o,oAuthConnectionId:i,prefilledRole:r,variant:s}=e;if(n){let e={orgId:a.Xs,redirectTo:l.BV.SNOWFLAKE_OAUTH_SUCCESS.getUrl({queryParams:{oAuthConnectionId:i,skipTokenFetch:"true"}})};window.open(l.BV.SSO_AUTH.getUrl({orgId:a.Xs,queryParams:e}),"_blank")}else c.open({prefilledRole:r,snowflakeOAuthConnectionId:i,dataConnectionId:t,dataConnectionName:o,variant:s})},authenticate:void 0};case i.Uz.bigquery:return{dialog:void 0,open:void 0,authenticate:e=>d(e)};case i.Uz.databricks:return{dialog:void 0,open:void 0,authenticate:e=>h(e)};default:throw Error(`Unsupported data connection type: ${n}`)}}},249e3:function(e,n,t){t.d(n,{N:()=>l,k:()=>a});var o=t(97747),i=t(467355);let a=(e,n)=>{switch(n){case o.XL.DATA_FRAME:return"FOREST";case o.XL.DYNAMIC:return e===o.u4.TABLE?"FOREST":"COBALT";default:return"COBALT"}},l=e=>{if(e===i.my.DATAFRAME)return"FOREST";if(e===i.my.SNOWPARK_DATAFRAME);else if(e===i.my.REMOTE_DATAFRAME)return"INDIGO";else if(e===i.my.ERROR)return"RED";else if(e===i.my.PIVOT_TABLE)return"TURQUOISE";return"COBALT"}}}]);
//# sourceMappingURL=0d74429e3f7283a9.contentHashV1.chunk.js.map