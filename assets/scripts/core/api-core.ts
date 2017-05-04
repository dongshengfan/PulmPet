
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
        console.log('API');
        console.log(putToModel);
        let factory = Animals.AnimalBuilder.instance();
        let animal:any;
       /* switch (putToModel){
            case 'lion':{
                animal=factory.create(lion);
                break;
            }
            case 'zebra':{
                animal=factory.create(zebra);
                break;
            }
            case 'mouse':{
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
            }
        }*/

        animal = factory.create(lion);
        console.log(lion);
        animal.id = id;
        return animal;
    }
}
