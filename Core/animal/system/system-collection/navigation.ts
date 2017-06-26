/**
 * Created by FIRCorp on 12.03.2017.
 */

namespace Animals.Systems {
    /**
     * Класс навигационной системы. Отвечает за ориентацию животного в пространстве. Поиск пути.
     */
    export class Navigation implements ISystem {
        /**
         * Субъективное состояние системы
         */
        state: Animals.Scales.SystemScale;

        /**
         * Ссылка на класс животного
         * @type {Animal}
         */
        _linkToAnimal: Animals.Animal;

        /**
         * Карта мира
         * @type {Map}
         */
        _map: MapGame.Map;

        /**
         * Точка текущего положения животного
         */
        _currentPoint: any;

        /**
         * Скорость смекалки/реакции
         */
        _speedSavvy: Animals.Scales.ArgumentScale;

        /**
         * Радиус зрения
         */
        _radiusVision: Animals.Scales.ArgumentScale;

        /**
         * Радиус слуха
         */
        _radiusHearing: Animals.Scales.ArgumentScale;

        /**
         * Радиус обоняния
         */
        _radiusSmell: Animals.Scales.ArgumentScale;

        /**
         * Радиус осязания
         */
        _radiusTouch: Animals.Scales.ArgumentScale;

        /**
         * Constructor of Navigation
         * @param scales объект шкалл
         */
        constructor(scales: any[]) {
            this._speedSavvy = null;
            this._radiusHearing = null;
            this._radiusTouch = null;
            this._radiusSmell = null;
            this._radiusVision = null;


            this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);

            this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
            this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
            this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
            this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
            this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];

            this._currentPoint = {
                x: 0,
                y: 0
            };

            this._map = MapGame.Map.instance();
        }

        set speedSavvy(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._speedSavvy = param;
            }
        }

        set radiusVision(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusVision = param;
            }
        }

        set radiusHearing(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusHearing = param;
            }
        }

        set radiusSmell(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusSmell = param;
            }
        }

        set radiusTouch(param: Animals.Scales.ArgumentScale) {
            if (param) {
                this._radiusTouch = param;
            }
        }


        get speedSavvy(): Animals.Scales.ArgumentScale {
            return this._speedSavvy;
        }

        get radiusVision(): Animals.Scales.ArgumentScale {
            return this._radiusVision;
        }

        get radiusHearing(): Animals.Scales.ArgumentScale {
            return this._radiusHearing;
        }

        get radiusSmell(): Animals.Scales.ArgumentScale {
            return this._radiusSmell;
        }

        get radiusTouch(): Animals.Scales.ArgumentScale {
            return this._radiusTouch;
        }


        /**
         * Изменить скорость смекалки  на процент
         * @param delta дельта изменения
         */
        public changeSpeedSavvy(delta: number): void {
            this._speedSavvy.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус зрения на процент
         * @param delta дельта изменения
         */
        public changeRadiusVision(delta: number): void {
            this._radiusVision.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус слуха на процент
         * @param delta дельта изменения
         */
        public changeRadiusHearing(delta: number): void {
            this._radiusHearing.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус обоняния на процент
         * @param delta дельта изменения
         */
        public changeRadiusSmell(delta: number): void {
            this._radiusSmell.change(delta);
            this.analysis();
        }

        /**
         * Изменить радиус осязания на процент
         * @param delta дельта изменения
         */
        public changeRadiusTouch(delta: number): void {
            this._radiusTouch.change(delta);
            this.analysis();
        }


        /**
         * Анализирует систему
         */
        public analysis(): void {
            this.state.analysis([
                this.radiusHearing,
                this.radiusTouch,
                this.radiusSmell,
                this.speedSavvy,
                this.radiusVision,
            ]);
        }

        /**
         * алгоритм нахождения пути
         * по идеи на вход подаются текущая точка и точка для достижения цели
         * Необходимые значения
         */
        public A(pointEnd: any): any {
            var tileStart: any = this._map.convertTiledPos(this._currentPoint);//сторонний метод
            var tileEnd: any = this._map.convertTiledPos(pointEnd); //сторонний метод
            //tileEnd=cc.p(13,14);
            //console.log(tileEnd);
            //console.log(tileStart);
            var closed: any = [];//посетили
            var open: any = [];//еще непосетиили
            open.push(tileStart);//начинаем со старта
            var puth: any = [];//карта которая восстанавливает в дальнейшем наш путь
            var arr: any = [];
            while (open.length > 0) {
                let curr = this.minF(open, tileEnd);
                if (curr.x === tileEnd.x && curr.y === tileEnd.y) {
                    return this.foundPuth(puth, tileEnd);
                }
                closed.push(curr);
                this.removeElement(curr, open);
                arr = [];
                this.getElementNotInClosedForCurr(closed, curr).forEach((element: any) => {
                    if (this.checkInMass(open, element)) {
                        arr.push(curr);
                        arr.push(element);
                        open.push(element);
                    }
                });
                puth.push(arr);
            }
            return false;
        }

        /**
         * конструирует путь до цели
         */
        public foundPuth(puth: any, end: any): any {
            let arr: any = [];
            for (let i = puth.length - 1; i >= 0; i--) {
                var row: any = puth[i];
                for (let j = 1, length = row.length; j < length; j += 2) {
                    if (end.x === row[j].x && end.y === row[j].y) {
                        arr.push(end);
                        end = row[j - 1];
                        break;
                    }
                }
            }
            return arr;
        }

        /**
         * Сглаживает путь
         *
         */
        public correctPuth(puth: any): any {
            if (puth) {
                let target: any = 1;
                var element1: any,
                    element2: any,
                    element3: any;
                while (target != 0) {
                    target = 0;
                    for (let i = 0; i < puth.length - 3; i++) {
                        element1 = puth[i],
                            element2 = puth[i + 1],
                            element3 = puth[i + 2];
                        if (Math.abs(element1.x - element3.x) === 1 && Math.abs(element1.y - element3.y) === 1) {
                            if (element2.x === element1.x) {
                                target = cc.v2(element3.x, element1.y);
                            } else {
                                target = cc.v2(element1.x, element3.y);
                            }
                            if (this._map.isCheсkObstacle(target)) {//сторонний метод
                                //надо удалить вершину puth[i+1];
                                puth.splice(i + 1, 1);
                            } else {
                                //сигнализируем об отсутствии вершины
                                target = 0;
                            }
                        }
                    }
                }
            }
            return puth;
        }

        /**
         * Возвращает матрицу соседей удовлетворяющих условиям и не числющихся в просмотренных
         */
        public getElementNotInClosedForCurr(closed: any, curr: any): any {
            let arr: any = [];
            let p: any;
            p = cc.p(curr.x, curr.y + 1);
            if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {   //сторонний 1 метод
                arr.push(p);
            }
            p = cc.p(curr.x, curr.y - 1);
            if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {//сторонний 1 метод
                arr.push(p);
            }

            p = cc.p(curr.x + 1, curr.y);
            if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {//сторонний 1 метод
                arr.push(p);
            }
            p = cc.p(curr.x - 1, curr.y);
            if (this._map.isCheсkObstacle(p) && this.checkInMass(closed, p)) {//сторонний 1 метод
                arr.push(p);
            }

            /*  p=cc.p(curr.x-1,curr.y+1);
             if(this.map.chek(p)&&this.checkInMass(closed,p)){
             arr.push(p);
             }
             p=cc.p(curr.x-1,curr.y-1);
             if(this.map.chek(p)&&this.checkInMass(closed,p)){
             arr.push(p);
             }
             p=cc.p(curr.x+1,curr.y+1);
             if(this.map.chek(p)&&this.checkInMass(closed,p)){
             arr.push(p);
             }
             p=cc.p(curr.x+1,curr.y-1);
             if(this.map.chek(p)&&this.checkInMass(closed,p)){
             arr.push(p);
             }
             */


            return arr;

        }

        /**
         * Проверяет находится ли элемент в массиве просмотренных или нет
         * @param {Array<any>} closed
         */
        public checkInMass(closed: any[], element: any): any {
            return closed.find((item: any) => item.x === element.x && item.y === element.y) ? false : true;
        }

        /**
         * Удалаяет указанный элемент из массива
         * @param {Array<any>} mass
         */
        public removeElement(element: any, mass: any[]) {
            var index: any = mass.findIndex((item: any) => element.x === item.x && element.y === item.y);
            mass.splice(index, 1);
            //return index? mass.splice(index,1) : false;
        }

        /**
         * Ищет такой элементкоторый самый близкий к финальной точке
         * @param {Array<any>} mas
         */
        public minF(mas: any, tileEnd: any): any {
            let min = Number.MAX_VALUE;
            let minItem = null;
            mas.forEach((item: any, i: any) => {
                var vremen: any = this.h(item, tileEnd);
                if (vremen < min) {
                    min = vremen;
                    minItem = item;
                }

            });
            return minItem;
        }

        /**
         * Эвристическая функция проврки расстояния до назанчения
         */
        public h(start: any, end: any): any {

            return Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
        }
    }
}