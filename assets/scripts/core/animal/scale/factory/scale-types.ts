/**
 * Created by FIRCorp on 20.02.2017.
 */
namespace Animals.Scales {
    /**
     * Типы шкал
     */
    export enum ScaleTypes{
        system,
        argument
    }

    /**
     * Виды аргументов
     */
    export enum ParameterScaleTypes{
        state = 1,//Общее состояние
        speed,//скорость
        weight,//вес
        heartbeat,//сердцебиение
        pressure,//давление
        amountPointRememberWater,//
        amountPointRememberGrass,//
        amountPointRememberMeat,//
        speedSavvy,//
        radiusVision,//
        radiusHearing,//
        radiusSmell,//
        radiusTouch,//
        newArg,
    }
}