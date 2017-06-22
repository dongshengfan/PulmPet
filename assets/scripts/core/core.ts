/**
 * Created by FIRCorp on 12.03.2017.
 */
/**
 * Класс апи
 */
class Core {
    /**
     *
     */
    static inst: Core;

    /**
     *
     * @returns {Core}
     */
    static instance(): Core {
        if (!this.inst) {
            this.inst = new Core();
        }
        return this.inst;
    }

    /**
     *
     * @returns {Animals.Animal}
     * @param putToModel
     * @param id
     */
    createAnimal(putToModel: any, id: any): Animals.Animal {
        let factory = Animals.AnimalBuilder.instance();
        let animal: any;
        switch (putToModel) {

            case 'lion': {
                animal = factory.create(lion);
                break;
            }

            /* case 'mouse':{
             animal=factory.create(mouse);
             break;
             }
             case 'hyena':{
             animal=factory.create(hyena);
             break;
             }
             case 'elephant':{
             animal=factory.create(elephant);
             break;
             }*/
        }

      //  animal = factory.create(lion);
        animal.id = id;
        return animal;
    }

    createMap(tiled:any){
        let map:any= MapGame.Map.instance();
        map.world=tiled;
    }
}
