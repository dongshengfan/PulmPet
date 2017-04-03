///<reference path="lion.ts"/>

/**
 * Created by FIRCorp on 12.03.2017.
 */
/**
 * Класс апи
 */
class APICore {
    /**
     *
     */
    static inst: APICore;


    /**
     *
     * @returns {APICore}
     */
    static instance(): APICore {
        if (!this.inst) {
            this.inst = new APICore();
        }
        return this.inst;
    }

    /**
     *
     * @returns {Animal}
     * @param putToModel
     * @param id
     */
    createAnimal(putToModel: any, id: any): Animals.Animal {
        let factory = Animals.AnimalBuilder.instance();
        let animal = factory.create(lion);
        animal.id = id;
        return animal;
    }
}
