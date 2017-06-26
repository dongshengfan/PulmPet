/**
 * Created by FIRCorp on 25.06.2017.
 */
/**
 * Главный управляющий сцены - загрузки
 */
cc.Class({
    extends: cc.Component,

    properties: {



    },

    onLoad () {
        let ls = cc.sys.localStorage;
        let t=[];
        let str='';
        let arr=[];
        t=ls.getItem('loadRes');
        for(let i=0; i< t.length;i++){
            if(t[i]===','){
                arr.push(str);
                str='';
            }else {
                str+=t[i];
            }
        }
        console.log(arr);
    },



});
