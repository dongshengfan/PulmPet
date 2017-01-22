/**
 * Custom events для рассылки сообщений об изменениях параметров систем
 */
const CommunicationEvents = {
    /**
     * выносливость
     */
    endurance: {
        /**
         * понижение
         */
        decrease: 0,
        /**
         * повышение
         */
        increase: 1
    },
    /**
     * возраст
     */
    age: {
        /**
         * старение
         */
        increase: 2
    },
    /**
     * скорость
     */
    speed: {
        /**
         * понижение
         */
        decrease: 3,
        /**
         * повышение
         */
        increase: 4
    },
    /**
     * вес
     */
    weight: {
        /**
         * понижение
         */
        decrease: 5,
        /**
         * повышение
         */
        increase: 6
    },
    /**
     * давление
     */
    pressure: {
        /**
         * понижение
         */
        decrease: 7,
        /**
         * повышение
         */
        increase: 8
    },
    /**
     * сердцебиение
     */
    heartbeat: {
        /**
         * понижение
         */
        decrease: 9,
        /**
         * повышение
         */
        increase: 10
    },
    
};

export { CommunicationEvents };