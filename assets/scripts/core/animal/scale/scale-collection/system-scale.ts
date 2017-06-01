/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animals.Scales {
    /**
     * Системная шкала (Отражает состояние системы в целом)
     */
    export class SystemScale extends AScale {
        /**
         * Constructor of SystemScale
         * @param params {Object}
         */
        constructor(params: any) {
            super();
            this._name = params.name || "No name";
            this._min = params.min || 0;
            this._max = params.max || 100;
            this._type = params.type || 0;
            this._current = params.current || this._max;
            this.getPercentageInScale();
        }

        /**
         * Оценивает состояние по состоянию шкал системы
         * @param params {ArgumentScale[]} оценки шкал систем
         */
        analysis(params: Animals.Scales.ArgumentScale[]): void {
            let rez = 0;
            params.forEach((param) => {
                rez += param.percent;
            });
            this.percent = rez / params.length;
            this.getCurrentValueOnScale();
        }
    }
}