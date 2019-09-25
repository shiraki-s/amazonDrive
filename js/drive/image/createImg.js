
function CreateImg(driveData) {

    const createImgElement = new CreateImgElement(driveData);
    const driveImage = new DriveImage(driveData);

    this.create = function (file, length, callback) {

        if (file.kind == "FILE" && file.contentProperties.image) {
            return createImage(file, length);
        }

        if (file.kind == "FOLDER") {
            return createFolder(file, length, callback);
        }

        if (file.kind == "FILE") {
            return createFile(file, length);
        }

        return null;

    }

    function createFolder(file, length, callback) {

        const folder = createImgElement.createFolder(file, length);
        folder.dataset.id = file.id;
        folder.dataset.parentId = file.parents[0];
        initFirstImage(folder, file.id);
        initClickFolder(folder, file, callback);
        initMouseOn(folder, file.id);
        return folder;
    }

    function createImage(file, length) {
        const f = createImgElement.createImage(file, length);
        f.dataset.id = file.id;
        f.dataset.parentId = file.parents[0];
        const img = f.getElementsByTagName("img")[0];
        initMouseOn(img, file.id);
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

    function isExistClass(classList, className) {

        for (var i = 0, len = classList.length; i < len; i++) {

            if (classList[i] == className) {
                return true;
            }
        }

        return false;
    }



}