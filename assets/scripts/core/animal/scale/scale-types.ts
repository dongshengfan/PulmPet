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
     * Типы параметра
     */
    export enum ParameterScaleTypes{
        state = 1,
        speed,
        weight,
        heartbeat,
        pressure,
        amountPointRememberWater,
        amountPointRememberGrass,
        amountPointRememberMeat,
        speedSavvy,
        radiusVision,
        radiusHearing,
        radiusSmell,
        radiusTouch,
    }
}