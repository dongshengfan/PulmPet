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
    }
};

export { CommunicationEvents };