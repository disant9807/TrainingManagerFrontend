"use strict";(self["webpackChunksmev_ui"]=self["webpackChunksmev_ui"]||[]).push([[906],{7569:function(s,t,e){e.r(t),e.d(t,{default:function(){return j}});var o=e(4145),i=e(4886),r=e(9256),l=e(5125),a=e(2540),n=function(){var s=this,t=s._self._c;s._self._setupProxy;return t("section",[t(o.Z,{staticClass:"pb-5"},[t(i.EB,{staticClass:"darkblue"},[s._v(" Настройки справочника «Пользователи» ")]),t(i.ZB,[t(r.Z,[t(l.Z,{ref:"form",attrs:{"lazy-validation":""}},[t(a.Z,[t("span",{staticClass:"text-h6"},[s._v("Настройки сложности пароля")])]),t("inline-text-field",{attrs:{label:"Минимальная длина пароля *",value:s.fields.passwordMinimumLength,rules:[s.rules.required,s.rules.number],hint:"Целое положительное число"},on:{"update:value":function(t){return s.$set(s.fields,"passwordMinimumLength",t)}}}),t("inline-radio-buttons-field",{attrs:{label:"Обязательное использование строчных букв *",objects:s.yesNo,selected:s.fields.passwordIsLowercases},on:{"update:selected":function(t){return s.$set(s.fields,"passwordIsLowercases",t)}}}),t("inline-radio-buttons-field",{attrs:{label:"Обязательное использование прописных букв *",objects:s.yesNo,selected:s.fields.passwordIsUpperCases},on:{"update:selected":function(t){return s.$set(s.fields,"passwordIsUpperCases",t)}}}),t("inline-radio-buttons-field",{attrs:{label:"Обязательное использование цифр *",objects:s.yesNo,selected:s.fields.passwordIsNumbers},on:{"update:selected":function(t){return s.$set(s.fields,"passwordIsNumbers",t)}}}),t("inline-radio-buttons-field",{attrs:{label:"Обязательное использование символов *",objects:s.yesNo,selected:s.fields.passwordIsSymbols},on:{"update:selected":function(t){return s.$set(s.fields,"passwordIsSymbols",t)}}})],1)],1)],1),t(i.h7,{staticClass:"ml-3"},[t("control-button",{attrs:{text:"Сохранить",icon:"content-save"},on:{onClick:s.save}}),t("control-button",{attrs:{text:"Отмена",icon:"cancel"},on:{onClick:s.cancel}})],1),t("Loader",{attrs:{value:s.isLoading}})],1)],1)},d=[],c=e(2482),u=e(655),p=e(5384),f=e(3940),h=e(9216),w=e(2296),y=e(4562),v=e(4324),m=function(){var s=this,t=s._self._c;s._self._setupProxy;return t(y.Z,{staticClass:"mr-2",attrs:{text:"",color:s.color,disabled:s.disabled},on:{click:s.click}},[t(v.Z,{staticClass:"mr-2"},[s._v(" "+s._s(`mdi-${s.icon}`)+" ")]),s._v(" "+s._s(s.text)+" ")],1)},g=[];let b=class extends f.w3{constructor(...s){super(...s),(0,c.Z)(this,"text",void 0),(0,c.Z)(this,"icon",void 0),(0,c.Z)(this,"color",void 0),(0,c.Z)(this,"disabled",void 0)}click(){this.$emit("onClick")}};(0,u.gn)([(0,f.fI)({type:String,default:""})],b.prototype,"text",void 0),(0,u.gn)([(0,f.fI)({type:String,default:""})],b.prototype,"icon",void 0),(0,u.gn)([(0,f.fI)({type:String,default:"darkblue"})],b.prototype,"color",void 0),(0,u.gn)([(0,f.fI)({type:Boolean,default:!1})],b.prototype,"disabled",void 0),b=(0,u.gn)([f.wA],b);var I=b,Z=I,C=e(1001),_=(0,C.Z)(Z,m,g,!1,null,null,null),x=_.exports,k=function(){var s=this,t=s._self._c;s._self._setupProxy;return t(y.Z,{staticClass:"mr-2",class:s.classes,attrs:{tile:"",small:"",depressed:"",color:s.color,disabled:s.disabled},on:{click:s.click}},[t(v.Z,{staticClass:"mr-2"},[s._v(" "+s._s(`mdi-${s.icon}`)+" ")]),s._v(" "+s._s(s.text)+" ")],1)},L=[];let S=class extends f.w3{constructor(...s){super(...s),(0,c.Z)(this,"text",void 0),(0,c.Z)(this,"icon",void 0),(0,c.Z)(this,"color",void 0),(0,c.Z)(this,"classes",void 0),(0,c.Z)(this,"disabled",void 0)}click(){this.$emit("onClick")}};(0,u.gn)([(0,f.fI)({type:String,default:""})],S.prototype,"text",void 0),(0,u.gn)([(0,f.fI)({type:String,default:""})],S.prototype,"icon",void 0),(0,u.gn)([(0,f.fI)({type:String,default:""})],S.prototype,"color",void 0),(0,u.gn)([(0,f.fI)({type:String,default:""})],S.prototype,"classes",void 0),(0,u.gn)([(0,f.fI)({type:Boolean,default:!1})],S.prototype,"disabled",void 0),S=(0,u.gn)([f.wA],S);var A=S,N=A,$=(0,C.Z)(N,k,L,!1,null,null,null),E=($.exports,e(1967)),D=e(8818),M=e(6486);let U=class extends p.Z{constructor(...s){super(...s),(0,c.Z)(this,"form",void 0),(0,c.Z)(this,"isLoading",!1),(0,c.Z)(this,"fields",{passwordActivityDay:null,passwordCountError:null,passwordMinimumLength:null,passwordIsLowercases:null,passwordIsUpperCases:null,passwordIsNumbers:null,passwordIsSymbols:null,lackOfActivityDay:null})}async created(){try{this.isLoading=!0;var s=await h.ZP.getSettings();null!==s&&(this.fields.lackOfActivityDay=s.lackOfActivityDay.toString(),this.fields.passwordActivityDay=s.passwordActivityDay.toString(),this.fields.passwordCountError=s.passwordCountError.toString(),this.fields.passwordMinimumLength=s.passwordMinimumLength.toString(),this.fields.passwordIsLowercases=s.passwordIsLowercases,this.fields.passwordIsUpperCases=s.passwordIsUpperCases,this.fields.passwordIsNumbers=s.passwordIsNumbers,this.fields.passwordIsSymbols=s.passwordIsSymbols,this.form.validate())}catch(t){t instanceof Error&&this.showError(t.message)}finally{this.isLoading=!1}}get yesNo(){return[{value:!0,text:"Сохранить настройки пользователя ?"},{value:!1,text:"Отменить сохранение настроек"}]}checkForm(){return!!this.form.validate()||(this.showError(this.$localize("failed","validation")),!1)}async save(){try{this.isLoading=!0;const s={lackOfActivityDay:(0,M.toInteger)(this.fields.lackOfActivityDay),passwordActivityDay:(0,M.toInteger)(this.fields.passwordActivityDay),passwordCountError:(0,M.toInteger)(this.fields.passwordCountError),passwordMinimumLength:(0,M.toInteger)(this.fields.passwordMinimumLength),passwordIsLowercases:this.fields.passwordIsLowercases,passwordIsUpperCases:this.fields.passwordIsUpperCases,passwordIsNumbers:this.fields.passwordIsNumbers,passwordIsSymbols:this.fields.passwordIsSymbols};await h.ZP.setSettings(s),this.$router.go(-1)}catch(s){s instanceof Error&&this.showError(s.message)}finally{this.isLoading=!1}}cancel(){this.$router.go(-1)}};(0,u.gn)([(0,f.Rl)("form")],U.prototype,"form",void 0),U=(0,u.gn)([(0,f.wA)({components:{ControlButton:x,InlineTextField:E.Z,InlineRadioButtonsField:D.Z,Loader:w.Z}})],U);var B=U,O=B,P=(0,C.Z)(O,n,d,!1,null,null,null),j=P.exports}}]);
//# sourceMappingURL=EditUsersSettings.f2314afd.js.map