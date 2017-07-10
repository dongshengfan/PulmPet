/**
 * Created by FIRCorp on 25.06.2017.
 */
/**
 * Тип системы
 * @type {{music: number, effect: number}}
 */
const TypeSounds = {
    music: 0,
    effect: 1
};

/**
 * Управляющий звуками
 */
cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: [],
            url: cc.AudioClip
        },

        _audioPool: [],//карта запущенных мелодий
    },

    onLoad () {
        this._audioPool = [];
    },


    update() {
        for (let i = 0; i < this._audioPool.length; i++) {
            let id = this._audioPool[i].id;
            let state = cc.audioEngine.getState(id);
            if (state < 0) {
                this._audioPool.splice(i, 1);
                i--;
            }
        }
    },

    /**
     * Выполняет поиск мелодии по имени мелодии среди строк урл путей всех мелодий данной сцены и выдает ее индекс
     * @param name {string} имя мелодии без расширения
     * @returns {number} индекс мелодии в массиве ауди клипов
     */
    findAudio(name){
        let i, arr = '';
        for (i = 0; i < this.audio.length; i++) {
            for (let j = this.audio[i].length - 1; j > 0; j--) {
                if (this.audio[i][j] != '/') {
                    arr += this.audio[i][j];
                } else {
                    break;
                }
            }
            arr = arr.slice(arr.indexOf('.') + 1);
            arr = arr.split("").reverse().join("");
            if (arr === name)   break;
            arr = '';
        }
        return arr === '' ? this.getError('Not found audio!') : i;
    },

    /**
     * Выполняет поиск ID в пуле запущенных мелодий и возвращает нужный по имени
     * @param name {string} имя мелодии
     * @returns {number} id мелодии в пуле проигрывающихся
     */
    findId(name){
        let id = -1;
        this._audioPool.forEach((item) => {
            if (item.name === name) {
                id = item.id;
            }
        });
        return id;
    },

    /**
     * Проверяет проигрывается ли эта композиция или нет
     * @param name имя композиции которую надо проверить
     * @returns {boolean} true - проигрывается в данный момент
     */
    isCheckAudio(name){
        let id = -1;
        this._audioPool.forEach((item) => {
            if (item.name === name) {
                id = item.id;
            }
        });
        return id != -1;
    },

    /**
     * Возвращает значение громкости от типа музыки
     * @param type тип звука
     * @returns {number}
     */
    _getVolume(type){
        let ls = cc.sys.localStorage;
        return (type === TypeSounds.effect) ? ls.getItem('volumeEffect') : ls.getItem('volumeMusic');
    },

    /**
     * Запускает эффект
     * @param name {string} имя эффекта
     * @param isLoop {boolean} зациклен ли он
     */
    playEffect(name, isLoop){
        let id = cc.audioEngine.play(this.audio[this.findAudio(name)], isLoop, this._getVolume(TypeSounds.effect));
        this._audioPool.push({id: id, name: name});
    },

    /**
     * Запускает мелодию
     * @param name {string} имя мелодии
     * @param isLoop {boolean} зациклена ли она
     */
    playMusic(name, isLoop){
        let id = cc.audioEngine.play(this.audio[this.findAudio(name)], isLoop, this._getVolume(TypeSounds.music));
        this._audioPool.push({id: id, name: name});
    },

    /**
     * Останавливает мелодию по имени
     * @param name {string} имя мелодии
     */
    stopAudio(name){
        let id = this.findId(name);
        if (id != -1) cc.audioEngine.stop(id);
    },

    /**
     * Останавливаетвсе мелодии
     */
    stopAll() {
        cc.audioEngine.stopAll();
    },

    /**
     * Приостанавливает все мелодии
     */
    pauseAll() {
        cc.audioEngine.pauseAll();
    },

    /**
     * Приостанавливает определенную мелодию
     * @param name имя мелодии
     */
    pauseAudio(name) {
        let id = this.findId(name);
        cc.audioEngine.pause(id);
    },

    /**
     * Продолжает музыку
     * @param name имя музыки
     */
    resumeMusic(name) {
        let id = this.findId(name);
        cc.audioEngine.resume(id);
        cc.audioEngine.setVolume(id, this._getVolume(TypeSounds.music));
    },

    /**
     * Продолжает эффект
     * @param name имя эффекта
     */
    resumeEffect(name){
        let id = this.findId(name);
        cc.audioEngine.resume(id);
        cc.audioEngine.setVolume(id, this._getVolume(TypeSounds.effect));
    },

    /**
     * Продолжает все мелодии
     */
    resumeAll () {
        cc.audioEngine.resumeAll();
    },

    /**
     * Кидает ошибку
     * @param msg {String} сообщение
     */
    getError(msg){
        throw new Error(msg);
    },

    /**
     * Устанавливает громкость эффектов
     * @param value {number} значение
     */
    setVolumeEffect(value){
        this._setVolume(TypeSounds.effect, value);
    },

    /**
     * Устанавливает громкость
     * @param type {TypeSounds} тип которому необходимо установить
     * @param value {number} тип которому необходимо установить
     */
    _setVolume(type, value){
        let ls = cc.sys.localStorage;
        if (type === TypeSounds.effect) {
            ls.setItem('volumeEffect', value);
        } else {
            ls.setItem('volumeMusic', value);
        }
    },

    /**
     * Устанавливает громкость музыки
     * @param value {number} значение
     */
    setVolumeMusic(value){
        this._setVolume(TypeSounds.music, value);
    },
});
