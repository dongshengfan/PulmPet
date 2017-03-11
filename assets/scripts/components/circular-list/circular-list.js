var CircularList = cc.Class({
    extends: cc.Component,

    properties: {
        _positionArray: [],
        _lengthBetweenPoints: 0,//расстояние между элементами
        _currentRadiant: 0,//угол вращения

        radius: 30,//радиус на котором будут крутится все кнопки
        amountList: 4,//количество элементов для вращения
        sensitivity: 1,//Чувствителность барабана к движению свайпа по координате
        list: cc.Node,
    },

    onLoad() {
        this.createList();
    },

    createPos() {
        this._lengthBetweenPoints = 2 * Math.PI / this.amountVisible;//Длинна между точками в радианах
        let currentRadians = 0, x, y;
        //начинаем с 0 по радианам 
        for (let i = 0; i < this.amountVisible; i++) {
            y = this.radius * Math.sin(currentRadians);
            x = this.radius * Math.cos(currentRadians);
            this._positionArray.push({pos: cc.v2(x, y), radians: currentRadians});
            currentRadians += this._lengthBetweenPoints;
        }
    },

    createList() {
        this.createPos();
        let amount = this.amountList - this.node.children.length;
        for (let i = 0; i < amount; i++) {
            let node = cc.instantiate(this.list);
            node.children[0].getComponent(cc.Label).string = i;
            this.node.addChild(node);
        }
        for (let i = 0; i < this.amountList; i++) {
            if (i < this.amountVisible) {
                this.node.children[i].setPosition(this._positionArray[i].pos);
            } else {
                this.node.children[i].active = false;
            }
        }

    },

    /**
     * Определение направления вращения
     * @param {any} x
     * @param {any} y
     * @param {any} locX
     * @param {any} locY
     */
    directionfinding(x, y, locX, locY) {
        if (locX > 0 && locY > 0) {
            this.obr1(x, y);
        } else if (locX < 0 && locY > 0) {
            this.obr2(x, y);
        } else if (locX < 0 && locY < 0) {
            this.obr3(x, y);
        } else if (locX > 0 && locY < 0) {
            this.obr4(x, y);
        } else {

        }
    },

    /**
     * Обработчик 1 чертверти
     * @param {any} x
     * @param {any} y
     * @param {any} locX
     * @param {any} locY
     */
    obr1(x, y){
        //если locX>0 и locY>0
        if (x > 0 && y < 0) {
            //понижаю радиана
            this.rotation(-this.convertToRadians(x, y));
        } else if (x < 0 && y > 0) {
            //повышаю радиана
            this.rotation(this.convertToRadians(x, y));
        } else if (x > 0 && y > 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //понижение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //повышение радиана
                this.rotation(this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else if (x < 0 && y < 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //повышение радиана
                this.rotation(this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //понижение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else {
            //ничего не делаем если они по 0
        }
    },

    obr2(x, y){
        //если locX<0 и locY>0
        if (x < 0 && y < 0) {
            //повышаю радиана
            this.rotation(this.convertToRadians(x, y));
        } else if (x > 0 && y > 0) {
            //понижаю радиана
            this.rotation(-this.convertToRadians(x, y));
        } else if (x > 0 && y < 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //понижение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //повышение радиана
                this.rotation(this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else if (x < 0 && y > 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //повышение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //понижение радиана
                this.rotation(this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else {
            //ничего не делаем если они по 0
        }
    },

    obr3(x, y){
        //locX<0&&locY<0
        if (x > 0 && y < 0) {
            //повышаю радиана
            this.rotation(this.convertToRadians(x, y));
        } else if (x < 0 && y > 0) {
            //понижаю радиана
            this.rotation(-this.convertToRadians(x, y));
        } else if (x > 0 && y > 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //понижение радиана
                this.rotation(this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //повышение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else if (x < 0 && y < 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //повышение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //понижение радиана
                this.rotation(this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else {
            //ничего не делаем если они по 0
        }
    },

    obr4(x, y){
        //locX>0&&locY<0
        if (x > 0 && y > 0) {
            //повышаю радиана
            this.rotation(this.convertToRadians(x, y));
        } else if (x < 0 && y < 0) {
            //понижаю радиана
            this.rotation(-this.convertToRadians(x, y));
        } else if (x > 0 && y < 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //повышение радиана
                this.rotation(this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //понижение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else if (x < 0 && y > 0) {
            //хм надо решать что делать
            if (Math.abs(x) > Math.abs(y)) {
                //повышение радиана
                this.rotation(-this.convertToRadians(x, y));
            } else if (Math.abs(x) < Math.abs(y)) {
                //понижение радиана
                this.rotation(this.convertToRadians(x, y));
            } else {
                //ничего не делаем
            }
        } else {
            //ничего не делаем если они по 0
        }
    },

    /**
     * Вращает барабан на delta в радианах
     * @param {any} delta
     */
    rotation(delta) {
        for (let i = 0; i < this.amountVisible; i++) {
            this._positionArray[i].radians += delta;
            this.node.children[i].x = this.radius * Math.cos(this._positionArray[i].radians);
            this.node.children[i].y = this.radius * Math.sin(this._positionArray[i].radians);
        }
    },

    /**
     * Переводит по координатам в радианы и возвращает радиан (длинну)
     * @param {any} x
     * @param {any} y
     */
    convertToRadians(x, y) {
        let d = Math.sqrt(x ** 2 + y ** 2);//поиск диагонали
        return (Math.abs(y) / d) * this.sensitivity;//угол в радианах    
    },
});

export { CircularList };