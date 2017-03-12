/**
 * Created by FIRCorp on 12.03.2017.
 */
/**
 *
 */
class APICore{
    /**
     *
     */
    static inst:APICore;

    /**
     *
     * @returns {APICore}
     */
    static instance():APICore{
        if(!this.inst){
            this.inst= new APICore();
        }
        return this.inst;
    }

    /**
     *
     * @param puthToModel
     * @returns {Animal}
     */
    createAnimal(puthToModel:any):Animals.Animal{
        let factory=Animals.AnimalBuilder.instance();
        return factory.create(lion);
    }
}