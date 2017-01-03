cc.Class({
    extends: cc.Component,

    properties: {
        sizeScreenX:0,
        sizeScreenY:0,
        pnlTimeAndAchiv:cc.Node,
        pnlMoney:cc.Node,
        pnlAchivBox:cc.Node,
        boxBtn:cc.Node,//бокс что внизу
        myLoad:cc.Node,//скрипт загрузки
  
        speedScale:0,
        loadClip:cc.Node,//Для загрузки по кнопкам
    },
   
    // use this for initialization
    onLoad:function() {
    //   console.log(this.getAmountAllStarContinent(0));
        let ls = cc.sys.localStorage;
         ls.setItem("achiv0progress",45);
      //  this.boxBtn.active=false;
        this.brain=false;//Думает контроллер кому сейчас работать
        this.sizeScreenX=this.node.width;
        this.sizeScreenY=this.node.height;
        this.setAmountStarContinent(0,0,345);
        this.setMoney(34);
      //  this.setTime(6);
        this.setAchivMoney(0,86000);
         this.setAmountLoopAchivSacsesful(0,6);
        /*this.setAchivMoney(1,300);
        this.setAchivMoney(2,50);
        this.setAchivMoney(3,6000);
        this.setAchivMoney(4,400);
        this.setAchivMoney(9,86000);//ничего не произойдет ведь нет такогоэлемента
        let money=this.getAchivMoney(5);//возвращает количество 
        this.setAmountLoopAchivSacsesful(0,34);//Устанавливает количество выполнений некоторой ачивки 
        let amountsacsesfuul=this.getAmountLoopAchivSacsesful(3);//возвращает количество 
        this.setAmounAchiv(0,this.getAmounAchiv(0)+3);*/
      /*  for(let i=0;i<9;i++){
            this.setAchivMoney(i,86);
            this.setAmountLoopAchivSacsesful(i,1);
            this.setAmounAchiv(i,3);
            
        }*/
        //this.scheduleOnce(function(){ this.setAmountLoopAchivSacsesful(0,3);},10);
       // this.setProgressAchiv(0,45);// устанавливает прогресс 0 очивки 45% выполнено
       this._setting();
    },
//---------------------------------------Функции ввода/вывода информации на сцене--------------------------------------------------------
    /**
     * Проверяет что не null вернувшееся начение
     * @param ls лок хранилище
     * @param name значение пришедшее из него
     * @param puth имя ячейки хранения
     */
    _chek(ls,name,puth){
        if(name===null){                
            ls.setItem(puth,0);
            name=0;                
        }
        return name;
    },
    /**
     * Настройка карты из лок файла */
    _setting(){
        let ls = cc.sys.localStorage;
       //Устанавливаем количество монет
        let money= ls.getItem("money");
        this.setMoney(money);
       //Устанавливаем время
        let time=ls.getItem("allTime");
        if(time===null){
            time=0;
            ls.setItem("allTime",0);
        }
        this.setTime(time);
       //Устанавливаем информацию об ачивках
        let amountAchiv=ls.getItem("amountAchiv");
        
        let perem,name;
        for(let i=0;i<amountAchiv;i++){            
            perem="achiv"+i;
            name=perem+"money";
            name=ls.getItem(name);
            name=this._chek(ls,name,perem+"money");
            this.setAchivMoney(i,name);

            name=perem+"amount";
            name=ls.getItem(name);
            name=this._chek(ls,name,perem+"amount");
            this.setAmounAchiv(i,name);

            name=perem+"sucsesful";
            name=ls.getItem(name);
            name=this._chek(ls,name,perem+"sucsesful");
            this.setAmountLoopAchivSacsesful(i,name);

            name=perem+"progress";
            name=ls.getItem(name);
            name=this._chek(ls,name,perem+"progress");
            console.log(name);
            this.setProgressAchiv(i,name);
        }
       //Устанавливает какой режим
        let rezhimid = ls.getItem("rezhimId");//0..4 какой режим был выбран
        let rezhParam="rezhim"+rezhimid+"star";
        let allStarRezh="rezhim"+rezhimid+"allstar";
        let amountContinent=ls.getItem("amountContinent");
        let a,b;
        for(let i=0;i<amountContinent;i++){
            a=rezhParam+i;
            b=allStarRezh+i;
            a=ls.getItem(a);
            a=this._chek(ls,a,rezhParam+i);
            b=ls.getItem(b);
            b=this._chek(ls,b,allStarRezh+i);
            this.setAmountStarContinent(i,a,b);
        }

       
    },
      /**
     * Сохраняет в лок файл */
    _save(){
       let ls = cc.sys.localStorage
       ls.setItem("money",this.getMoney());

       let amountAchiv=ls.getItem("amountAchiv");
       let perem,name;
       for(let i=0;i<amountAchiv;i++){
            perem="achiv"+i;
            name=perem+"money";
            ls.setItem(name,this.getAchivMoney(i));
            name=perem+"amount";
            ls.setItem(name,this.getAmounAchiv(i));
            
            name=perem+"sucsesful";
            ls.setItem(name,this.getAmountLoopAchivSacsesful(i));
            name=perem+"progress";
            ls.setItem(name,this.getProgressAchiv(i));       
       }

    },
    /**
     * Настройка прогрес бара у ачивки  
     * @param
     * id-Какая ачивка
     * amount- Процентное выполнение
    */
    setProgressAchiv(id,amount){
        let puth=["viewport","content","achiv"+id.toString(),"progress"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){    
            let str=amount/100;
            target.getComponent(cc.ProgressBar).progress+=str;
        } 
    },

    /**
     * Возвращает прогресс ачивки
     * @param id Идентификатор ачивки
     * @returns target.getComponent(cc.ProgressBar).progress прогресс от 0..1
     */
    getProgressAchiv(id){
        let puth=["viewport","content","achiv"+id.toString(),"progress"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){    
          return (target.getComponent(cc.ProgressBar).progress)*100;
        } 
        return -1;
    },
    /**
     * Установка количества звезд  у континентов
     * @param id идентификатор континента
     * @param amount текущееколичество звезд 
     * @param allAmount вообщедоступно звезд
     */
    setAmountStarContinent(id,amount,allAmount){
        let puth=["Map","view","content","map","cont"+id.toString(),"pnlStar","lbl"];
        let target=this._seach(puth,this.node);
        if(target){    
            
            target.getComponent(cc.Label).string=amount+"/"+allAmount;
        } 
    },
    /**
     * Возвращает  текущее количества звезд  у континента
     * @param id идентификатор континента
     * @returns st число до /
     */
    getAmountStarContinent(id){
        let puth=["Map","view","content","map","cont"+id.toString(),"pnlStar","lbl"];
        let target=this._seach(puth,this.node);
        if(target){
            let str= target.getComponent(cc.Label).string;
            let st="";
            for(let i=0;i<str.length;i++){
                if(str[i]==='/'){
                    break;
                }
                st+=str[i];
            }
            return parseInt(st);
        } 
        return -1;

    },
    /**
     * Возвращает все  количество звезд  у континента
     * @param id идентификатор континента
     * @returns st число до /
     */
    getAmountAllStarContinent(id){
        let puth=["Map","view","content","map","cont"+id.toString(),"pnlStar","lbl"];
        let target=this._seach(puth,this.node);
        if(target){
            let str= target.getComponent(cc.Label).string;
            let st="";
            let f=false;
            for(let i=0;i<str.length;i++){
                if(f){
                st+=str[i];
                }
                if(str[i]==='/'){
                    f=true;               
                }
                
            }
            return parseInt(st);
        } 
        return -1;

    },
    /**
     * Закрывает штамп у ачивкe
     * @param
     * id-ид ачивки 
    */
    closeShtampInAchiv(id){
        let puth=["viewport","content","achiv"+id.toString(),"pnlShtamp"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
            this.setAmountLoopAchivSacsesful(id,0);
            target.active=false;
        }
    },

    /**
     * Возвращает количество некоторой ачивки 
     * @param id-идентификато ачивки
     *  @returns
     * target.getComponent(cc.Label).string-Количество ачивки
     * (-1)- такой ачивки нет
    */
    getAmounAchiv(id){
        let puth=["viewport","content","achiv"+id.toString(),"info","amountAchiv"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
           return parseInt(target.getComponent(cc.Label).string);
        }else{
            return -1;
        }   
    },

    /**
     * Устанавливает количество некоторой ачивки 
     * @param id идентификато ачивки
     * @param amount количество в наличии 
     * @returns
    */
    setAmounAchiv(id,amount){
        let puth=["viewport","content","achiv"+id.toString(),"info","amountAchiv"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){           
            target.getComponent(cc.Label).string=amount;
        } 
    },

    /**
     * Возвращает количество выполнений некоторой ачивки 
     * @param
     * id-идентификато ачивки
     *  @returns
     * target.getComponent(cc.Label).string-Количество выполнений ачивки
     * (-1)- такой ачивки нет
    */
    getAmountLoopAchivSacsesful(id){
        let puth=["viewport","content","achiv"+id.toString(),"pnlShtamp","amount"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
            target=target.getComponent(cc.Label).string;
            let summ="";
            for(let i=0;i<target.length;i++){
                if(i>1){
                    summ+=target[i];
                }
            }
           return parseInt(summ);
        }else{
            return -1;
        }   
    },

    /**
     * Устанавливает количество выполнений некоторой ачивки 
     * @param
     * id-идентификато ачивки
     * amount- количество раз выполнения её 
    */
    setAmountLoopAchivSacsesful(id,amount){
        let puth=["viewport","content","achiv"+id.toString(),"pnlShtamp"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
            if(amount>=1){
                target.active=true; 
            }
            let Lblamount=this._find("amount",target);
            if(Lblamount){ 
                if(amount>=1){
                this.setBtnWarrion();  
                }    
                Lblamount.getComponent(cc.Label).string="x "+amount;
            }  
        }
    },

    /**
     * Возвращает цену вознаграждения у афивки по индексу
     * @param
     * id-номер ачивки из базы
     * @returns
     * target.getComponent(cc.Label).string-Количество монет
     * (-1)- такой ачивки нет
    */
    getAchivMoney(id){
        let puth=["viewport","content","achiv"+id.toString(),"info","pnlCountAchiv","count"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
           return parseInt(target.getComponent(cc.Label).string);
        }else{
            return -1;
        }        
    },

    /**
     * Устанавливает цену вознаграждения у ачивки 
     * @param
     * id-номер ачивки у нас в базе
     * amount-сума вознагрождения
    */
    setAchivMoney(id,amount){
        let puth=["viewport","content","achiv"+id.toString(),"info","pnlCountAchiv","count"];
        let target=this._seach(puth,this.pnlAchivBox);
        if(target){
           
            target.getComponent(cc.Label).string=amount;
        }        
    },

    

    /**
     * Устанавает количество монет у игрока 
     * @param
     * #amount- количество монет
    */
    setMoney(amount){
        let mas=this.pnlMoney.children;
        for(let i=0;i<mas.length;i++){
            if(mas[i].name==="amount"){
                mas[i].getComponent(cc.Label).string=amount;
                break;
            }
        }
    },

    /**
     * Возвращает количество монет у игрока 
     * @returns
     * summ-количество монет у игрока
    */
    getMoney(){
        let summ=false;
        let mas=this.pnlMoney.children;
        for(let i=0;i<mas.length;i++){
            if(mas[i].name==="amount"){
                summ=parseInt(mas[i].getComponent(cc.Label).string);
                //console.log(summ);
                return summ;
            }
        }
        return summ;
    },

    /**
     * Устанавливает проведенное время игроком в игре
     * @param 
     * #time - Количество минут
     * 
     */
    setTime(time){
        let mas=this.pnlTimeAndAchiv.children;
        for(let i=0;i<mas.length;i++){
            if(mas[i].name==="time"){
                mas[i].getComponent(cc.Label).string="";
                let m=Math.floor(time/60);//сколько минут
                let h=Math.floor(m/60);//сколько часов
                let d=Math.floor(h/24);//сколько дней
                mas[i].getComponent(cc.Label).string+=d+". "+(h-d*24)+":"+(m-h*60)+":"+(time-m*60);
                break;
            }
        }
    },

    /**
     * Устанавливает предупреждение если появилась новая выполненная ачивка
     * 
     */
    setBtnWarrion(){
        let btnWarrrior=this._find("wrr",this.pnlTimeAndAchiv);
        if(this.pnlAchivBox.active){
            if(btnWarrrior){
                    btnWarrrior.active=false;
            }
        }else{
            if(btnWarrrior){
                    btnWarrrior.active=true;
            }
        }
    },

    /**
     * Рекурсивный поиск позаданному пути нужного нода
     * @param
     * puth-путь спуска до элемента
     * tree-дерево на котором осуществляется поиск
     * @returns
     * a-Найденый нод
     */
    _seach(puth,tree){
        let a=this._find(puth[0],tree);
        puth.shift();
        if(a){           
            if(puth.length>0){
                a=this._seach(puth,a);    
            }
        }
        return a;
    },

    /**
     * Ищет у нода ребенка по имени 
     * @param
     * name-имя нода для поиска
     * content- текущий узел дерева узел
     * @returns
     * content.children[i]-ребенок соответствующий имени
     * false-такого ребенка у узла нет
    */
    _find(name,content){
        for(let i=0;i<content.children.length;i++){
             if(content.children[i].name===name){
                 return content.children[i];
             }
        }
        return false;
    },







//----------------------------------------Clik-----------------------------------------------

    /**
     * Реакция на нажатие любой ачивки:
     * Снятие штампа выполнения и начисление вознаграждения
     * @param 
     * event-Таргет элемента
     */
    clikAchiv(event){
        let btn=event.currentTarget;
        let name=btn.name;
        let id="";
        for(let i=0;i<name.length;i++){
            if(i>4){
                id+=name[i];
            }
        }
        id= parseInt(id);    
        //this.playAnimation("AchivClik");
        let money=this.getMoney();     
        let amountAchiv=this.getAmounAchiv(id);  
        let amountSacsesful=this.getAmountLoopAchivSacsesful(id);   
        let moneyAchiv=this.getAchivMoney(id);  
        this.setMoney(money+moneyAchiv*amountSacsesful);  
        this.setAmounAchiv(id,amountAchiv+amountSacsesful);
        this.closeShtampInAchiv(id);    
    },

    /**
     * нажатие на панель времени икнопку окей в ачивках */
    clikPnlTimeAndAchiv(){
      //  this.brain=!this.brain;
        if(this._chekSoJobBtn()){
           
            let btnWarrrior=this._find("BtnWarrior",this.pnlTimeAndAchiv);
            if(this.pnlAchivBox.active){
                this.boxBtn.active=true;
                this._find("Map",this.node).getComponent(cc.ScrollView).enabled=true;       
                this.pnlAchivBox.active=false;
            }else{                
                this._find("Map",this.node).getComponent(cc.ScrollView).enabled=false;       
                this.boxBtn.active=false;
                this.pnlAchivBox.active=true;
                this.setBtnWarrion();
            }
        }
    },

    /**
     * Нажатие на понель средств */
    clikPnlMoney(){
        if(this._chekSoJobBtn()){
        cc.log("Хей задонать! и в этом тебе поможет Саша");

        }
       
    },

    clikBtnLibrary(){
        if(this._chekSoJobBtn()){
            this.brain=true;
             this.boxBtn.active=false; 
             this._save();  
            this.loadLibrary();
        }
    },

    clikBtnInfo(){
        if(this._chekSoJobBtn()){
            this.brain=true;
             this.boxBtn.active=false; 
             this._save(); 
            this.loadInfo();
        }
    },

    clikBtnRezhim(){
        if(this._chekSoJobBtn()){
              this.brain=true;
               this.boxBtn.active=false;   
               this._save();
              this.loadRezhim();
        }
    },

    clikBtnShop(){
        if(this._chekSoJobBtn()){
           this.brain=true;
            this.boxBtn.active=false;  
            this._save(); 
           this.loadShop();
        }
    },

    /**
     * Нажатие на континент
     * @param
     * map-карта которую необходимоприблизить
     * pos-позиция нажатия на курсор
     * id-что мы грузим 
     * 0-африка
     * 1-европа
     */
    clikMap(map,pos,id){
        if(this._chekSoJobBtn()&& this._find("Map",this.node).getComponent(cc.ScrollView).enabled===true){ 
                this.brain=true; 
                this._find("Map",this.node).getComponent(cc.ScrollView).enabled=false;  
                this.boxBtn.active=false;

                //Устанавливаем номер ареала
                 let ls = cc.sys.localStorage;
                 ls.setItem("continent",id);  
                 this._save();             
                this.zoom(map,pos);
                this.loadContinent();
              
        }
    },

    /**
     * Приближение к указаной точке
     * @param
     * map- карта
     * pos- позиция указанная к приближению
     */
    zoom(map,pos){
        let centerX=this.sizeScreenX/2;
        let smeX=Math.abs(centerX-pos.x);
        let centerY=this.sizeScreenY/2;     
        let smeY=Math.abs(centerY-pos.y);      

        let callBack=function () {
            if(map.scaleX>2&&map.scaleY>2){
                this.unschedule(callBack);						 
            }
            if(smeY>0){
                if(pos.y>centerY){
                    map.y-=0.2;
                }else if(pos.y<centerY){
                    map.y+=0.2;
                }
                 smeY-=0.2;
               
            }
             if(smeX>0){
                if(pos.x>centerX){
                    map.parent.x-=0.5;
                }else if(pos.x<centerX){
                    map.parent.x+=0.5;
                }
                 smeX-=0.5;
               
            }
          //  console.log(smeY);
           
            map.scaleX+=0.001;
            map.scaleY+=0.001;
          //  smeY=(smeY/100)*101;
            }
        this.schedule(callBack,this.speedScale);
    },

  

    /**
     * Проверяет возможно  ли нажать сейчас данный индек
     * 
     */
    _chekSoJobBtn(){

        /**Какая-то логика
         */
        if(this.brain){
            return false;
        }else{
            return true;
        }
    },

 

//------------------------------------------Loading-------------------------------------------
    /**
     * Загрузка Shopa */
    loadShop(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3")
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
               // this.boxBtn,
               this.pnlTimeAndAchiv,
                this.pnlMoney,
        
            ]
        ); 
       this.myLoad.getComponent("Load").addElementForUpOpacity(
            [
            
                this.loadClip,
                

            ]
        ); 
        this.myLoad.getComponent("Load").setBar(true);
      //  this.myLoad.getComponent("Load").setAmountFacts(3);
        this.myLoad.getComponent("Load").setTimeZaderzhka(1);
        this.myLoad.getComponent("Load").loadMap('Shop');
    },

    /**
     * Загрузка Библиотеки */
    loadLibrary(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3")
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
              this.pnlTimeAndAchiv,
                this.pnlMoney,
                
            ]
        );
        this.myLoad.getComponent("Load").addElementForUpOpacity(
            [
            
                this.loadClip,
                

            ]
        ); 
        this.myLoad.getComponent("Load").setBar(true);
       // this.myLoad.getComponent("Load").setAmountFacts(3);
        this.myLoad.getComponent("Load").setTimeZaderzhka(1);      
        this.myLoad.getComponent("Load").loadMap('Library');
    },

    /**
     * Загрузка Информации о нас */
    loadInfo(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3"),
                cc.url.raw("resources/audio/angryPlant.mp3"),
                cc.url.raw("resources/audio/beeBuzz.mp3"),
                cc.url.raw("resources/audio/AddBall.mp3")
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
                this.pnlTimeAndAchiv,
                this.pnlMoney,
             
            ]
        ); 
        this.myLoad.getComponent("Load").addElementForUpOpacity(
            [
            
                this.loadClip,
                

            ]
        ); 
        this.myLoad.getComponent("Load").setBar(true);
      //  this.myLoad.getComponent("Load").setAmountFacts(3);
        this.myLoad.getComponent("Load").setTimeZaderzhka(1);     
        this.myLoad.getComponent("Load").loadMap('Info');
    },

    /**
     * Загрузка Режимов */
    loadRezhim(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3")
              
                
            ]
        );
        this.myLoad.getComponent("Load").addElement(
            [
                this.pnlTimeAndAchiv,
                this.pnlMoney,
          
            ]
        ); 
        this.myLoad.getComponent("Load").addElementForUpOpacity(
            [
            
                this.loadClip,
                

            ]
        ); 
        this.myLoad.getComponent("Load").setBar(true);
       // this.myLoad.getComponent("Load").setAmountFacts(3);
        this.myLoad.getComponent("Load").setTimeZaderzhka(1);     
        this.myLoad.getComponent("Load").loadMap('Rezhim');
    },

    /**
     * Загрузка какого либо континента
     * @param
     * name- имя континента
     */
    loadContinent(){
        this.myLoad.getComponent("Load").addLoad(
            [
                cc.url.raw("resources/audio/AddBall.mp3")
              
                
            ]
        );
        /**Какие элементы при загрузке не отображать */
        this.myLoad.getComponent("Load").addElement(
            [
            
                this.pnlTimeAndAchiv,
                this.pnlMoney,

            ]
        ); 
        
         
       this.myLoad.getComponent("Load").setTimeZaderzhka(6);
        this.myLoad.getComponent("Load").loadMap('Areal');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
