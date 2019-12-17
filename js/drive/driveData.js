

function DriveData() {

    let pswp;
    let nowDir;
    let preDir;
    let nowDirName;
    let firstImages = {};
    let cashes = {};
    let imageSrcs = [];
    let authToken;
    let authTokenLimit;
    let elementWidth;
    let elementLength;
    let isKeyEvent;
    let isDownloadMode;
    let mouseOverFileId;

    this.setPswp = function (_pswp) {
        pswp = _pswp;
    }

    this.getPswp = function () {
        return pswp;
    }

    this.getPreDir = function () {
        return preDir;
    }

    this.setPreDir = function (_preDir) {
        preDir = _preDir;
    }

    this.getNowDirName = function () {
        return nowDirName;
    }

    this.setNowDirName = function (_nowDirName) {
        nowDirName = _nowDirName;
    }

    this.addFirstImage = function (id, file) {

        if (!firstImages[id]) {
            firstImages[id] = file;
        }
    }

    this.removeFirstImage = function (id) {

        if (firstImages[id]) {
            delete firstImages[id];
        }
    }

    this.getFirstImage = function (id) {
        return firstImages[id];
    }

    this.getAuthTokenLimit = function () {
        return authTokenLimit;
    }

    this.setAuthTokenLimit = function () {

        const date = new Date();
        date.setHours(date.getHours() + 1);
        authTokenLimit = date.getTime();
    }

    this.getNowDir = function () {
        return nowDir;
    }

    this.setNowDir = function (_nowDir) {
        nowDir = _nowDir;
    }

    this.getCash = function (id) {
        return cashes[id];
    }

    this.removeFile = function (path, id) {

        const cash = cashes[path];

        if (!cash) {
            return;
        }

        const files = cash.data;
        const newFiles = [];

        for (let i = 0, len = files.length; i < len; i++) {

            if (files[i].id != id) {
                newFiles.push(files[i]);
            }

        }

        cash.data = newFiles;

    }

    this.addCash = function (id, json) {

        if (!cashes[id]) {
            cashes[id] = json;
        }

    }

    this.removeCash = function (id) {

        if (cashes[id]) {
            delete cashes[id];
        }
    }

    this.getAuthToken = function () {
        return authToken;
    }

    this.setAuthToken = function (_authToken) {
        authToken = _authToken;
    }

    this.getElementWidth = function () {
        return elementWidth;
    }

    this.setElementWidth = function (_elementWidth) {
        elementWidth = _elementWidth;
    }

    this.getElementLength = function () {
        return elementLength;
    }

    this.setElementLength = function (_elementLength) {
        elementLength = _elementLength;
    }

    this.setKeyEvent = function (_isKeyEvent) {
        isKeyEvent = _isKeyEvent;
    }

    this.isKeyEvent = function () {
        return isKeyEvent;
    }

    this.setMouseOverFileId = function (_mouseOverFileId) {
        mouseOverFileId = _mouseOverFileId;
    }

    this.getMouseOverFileId = function () {
        return mouseOverFileId;
    }

    this.isDownloadMode = function () {
        return isDownloadMode;
    }

    this.setDownloadMode = function (_isDownloadMode) {
        isDownloadMode = _isDownloadMode;
    }

    this.setImageSrcs = function (_imageSrcs) {
        imageSrcs = _imageSrcs;
    }

    this.getImageSrc = function (name) {

        for (let i = 0, len = imageSrcs.length; i < len; i++) {

            if (imageSrcs[i].name == name) {
                return imageSrcs[i].src;
            }

        }

        return "";

    }

}