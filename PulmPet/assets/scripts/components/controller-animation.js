/**
 * Created by FIRCorp on 25.06.2017.
 */
/**
 * Управляющий анимациями
 */
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
    },

    /***
     * Запускает анимацию по имени паралельно остальным
     * @param name {String} имя анимации
     */
    startAnimationAdditive(name){
        this.anim.playAdditive(name);
    },

    /***
     * Запускает анимацию по имени останавливая остальные
     * @param name {String} имя анимации
     */
    startAnimation(name){
        this.anim.play(name);
    },

    /**
     * Останавливает анимацию
     * @param name {String} имя анимации
     */
    stopAnimation(name){
        this.anim.stop(name);
    },

    /**
     * Приостанавливает анимацию
     * @param name {String} имя анимации
     */
    pauseAnimation(name){
        this.anim.pause(name);
    },

    /**
     * Продолжает анимацию
     * @param name {String} имя анимации
     */
    resumeAnimation(name){
        this.anim.resume(name);
    },

    /**
     * Возвращает продолжительность конкретного анимационного клипа
     * @param name {String} имя анимационного клипа
     * @returns {*}
     */
    getTime(name){
        let arrClips = this.anim.getClips();
        let time = null;
        arrClips.forEach((item) => {
            if (item.name === name) {
                time = item.duration / item.speed * 1000;
            }
        });
        return time ? time : this.getError('Not found animation clip');
    },

    /**
     * Кидает ошибку
     * @param msg {String} сообщение
     */
    getError(msg){
        throw new Error(msg);
    },

});
