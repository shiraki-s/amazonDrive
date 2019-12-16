
function CreateImg(driveData) {

    const createImgElement = new CreateImgElement();
    const driveImage = new DriveImage(driveData);

    this.create = function (file, length, clickCallback, tapCallback) {

        if (file.kind == "FILE" && file.contentProperties.image) {
            return createImage(file, length, tapCallback);
        }

        if (file.kind == "FOLDER") {
            return createFolder(file, length, clickCallback, tapCallback);
        }

        if (file.kind == "FILE") {
            return createFile(file, length);
        }

        return null;

    }

    function createFolder(file, length, clickCallback, tapCallback) {

        const folder = createImgElement.createFolder(file, length);
        folder.dataset.id = file.id;
        folder.dataset.parentId = file.parents[0];
        initFirstImage(folder, file.id);
        initClickFolder(folder, file, clickCallback);
        initMouseOn(folder, file.id);
        initHoldOn(folder, file, 2000, tapCallback);
        return folder;
    }

    function createImage(file, length, tapCallback) {

        let f;

        if (isAPng(file.labels)) {
            f = createImgElement.createApngImage(file, length);

        } else {
            f = createImgElement.createImage(file, length);
        }

        f.dataset.id = file.id;
        f.dataset.parentId = file.parents[0];
        const img = f.getElementsByTagName("img")[0];
        initMouseOn(img, file.id);
        initHoldOn(img, file, 2000, tapCallback);
        return f;
    }

    function createFile(file, length) {

        const f = createImgElement.createFile(file, length);
        f.dataset.id = file.id;
        f.dataset.parentId = file.parents[0];

        const img = f.getElementsByTagName("img")[0];
        initMouseOn(img, file.id);
        return f;
    }

    this.createWhiteSpace = function (width, height) {
        return createImgElement.createWhiteSpace(width, height);
    }

    function initMouseOn(element, id) {

        element.addEventListener("mouseover", function () {

            const menu = document.getElementById("contextmenu");
            const dialog = document.getElementById("moveDialog");

            if (isExistClass(menu.classList, "menu_on") ||
                isExistClass(dialog.classList, "dialog_on")) {
                return
            }

            driveData.setMouseOverFileId(id);
        });

        element.addEventListener("mouseleave", function () {

            const menu = document.getElementById("contextmenu");
            const dialog = document.getElementById("moveDialog");

            if (isExistClass(menu.classList, "menu_on") ||
                isExistClass(dialog.classList, "dialog_on")) {
                return;
            }

            driveData.setMouseOverFileId(null);
        });
    }

    function initHoldOn(element, file, holdtime, callback) {

        let interval;

        element.addEventListener("touchstart", function (e) {

            if (driveData.isDownloadMode()) {

                e.preventDefault();

                let time = 0;

                interval = setInterval(function () {

                    time += 100;

                    if (time > holdtime) {
                        callback(file);
                        clearInterval(interval);
                    }

                }, 100);
            }


        });

        element.addEventListener("touchend", function (e) {

            if (driveData.isDownloadMode()) {
                e.preventDefault();
                clearInterval(interval);
            }
        });

    }

    function initClickFolder(folder, file, callback) {

        folder.addEventListener("click", function () {
            callback(file);
        });

    }

    function initFirstImage(folder, id) {

        getFirstFile(id, function (file) {

            if (file && file.kind == "FILE" && file.contentProperties.image) {

                const imgEl = folder.getElementsByTagName("img")[0];
                imgEl.setAttribute("src", file.imgUrl);

                folder.classList.remove("folder");
                folder.classList.add("imageFolder");
            }

        });

    }

    function getFirstFile(id, callback) {

        const file = driveData.getFirstImage(id);

        if (file) {
            callback(file);
            return;
        }

        driveImage.getFirstFile(id, function (file) {
            driveData.addFirstImage(id, file);
            callback(file);
        });

    }

    function isAPng(labels) {

        for (let i = 0, len = labels.length; i < len; i++) {

            if (labels[i] == "aPng") {
                return true;
            }
        }

        return false;
    }

    function isExistClass(classList, className) {

        for (var i = 0, len = classList.length; i < len; i++) {

            if (classList[i] == className) {
                return true;
            }
        }

        return false;
    }



}