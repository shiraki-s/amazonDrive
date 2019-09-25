
function MoveDialog(driveData) {

    const createDialog = new CreateMoveDialogElement();
    const driveImage = new DriveImage(driveData);
    let parentId;

    this.init = function (moveCallback) {

        const body = document.getElementsByTagName("body")[0];
        const dialog = createDialog.create();
        initClose(dialog);
        initMove(dialog, moveCallback);

        body.appendChild(dialog);
    }

    this.view = function () {

        const ul = document.querySelectorAll(".breadcrumbs.folder-path")[0];
        const lis = ul.getElementsByTagName("li");

        const breads = getBreads(lis, driveData.getNowDir());
        parentId = breads[breads.length - 1].id;
        initBreads(breads);

        const folders = getFolders(driveData.getNowDir());
        initFolders(folders);

        const dialog = document.getElementById("moveDialog");
        dialog.classList.add("dialog_on");
        dialog.style.display = "block";
    }

    function getBreads(lis, id) {

        const breads = [];

        for (let i = 0, len = lis.length; i < len; i++) {

            let newId = lis[i].dataset.id;
            const a = lis[i].getElementsByTagName("a")[0];

            if (!newId) {
                newId = a.dataset.id;
            }

            breads.push({
                name: a.textContent,
                id: newId
            });

            if (newId == id) {
                break;
            }
        }

        return breads;

    }

    function getFolders(id) {

        const cash = driveData.getCash(id);
        const files = cash.data;

        const folders = [];

        for (let i = 0, len = files.length; i < len; i++) {

            if (files[i].kind == "FOLDER") {

                folders.push({
                    name: files[i].name,
                    id: files[i].id
                });
            }

        }

        return folders;

    }

    function initBreads(breads) {

        const dialog = document.getElementById("moveDialog");
        const ul = dialog.querySelectorAll(".breadcrumbs.folder-path")[0];
        ul.textContent = null;

        const breadFragment = document.createDocumentFragment();

        for (let i = 0, len = breads.length; i < len; i++) {
            const li = createDialog.createBread(i, breads[i].name);
            li.dataset.id = breads[i].id;
            initClickBread(li);
            breadFragment.appendChild(li);
        }

        ul.appendChild(breadFragment);

    }

    function initFolders(folders) {

        const dialog = document.getElementById("moveDialog");

        const page = dialog.getElementsByClassName("page")[1];
        const ul = page.getElementsByClassName("list-layout")[0];
        ul.textContent = null;

        const folderFragment = document.createDocumentFragment();

        for (let i = 0, len = folders.length; i < len; i++) {
            const li = createDialog.createFolder(folders[i].name);
            li.dataset.id = folders[i].id;
            initClickFolder(li);
            folderFragment.appendChild(li);
        }

        ul.appendChild(folderFragment);

    }


    function initClickBread(li) {

        li.addEventListener("click", function () {

            const dialog = document.getElementById("moveDialog");
            const ul = dialog.querySelectorAll(".breadcrumbs.folder-path")[0];
            const lis = ul.getElementsByTagName("li");

            const id = li.dataset.id;
            const cash = driveData.getCash(id);

            const breads = getBreads(lis, id);

            if (cash) {
                const folders = getFolders(id);
                changeMoveButton(folders, id, li.textContent);
                initFolders(folders);
                initBreads(breads);
                return;
            }

            driveImage.getImages(id, function (json) {
                driveData.addCash(id, json);
                const folders = getFolders(id);
                changeMoveButton(folders, id, li.textContent);
                initFolders(folders);
                initBreads(breads);
            });

        });

    }

    function initClickFolder(li) {

        li.addEventListener("click", function () {

            const dialog = document.getElementById("moveDialog");
            const ul = dialog.querySelectorAll(".breadcrumbs.folder-path")[0];
            const lis = ul.getElementsByTagName("li");

            const id = li.dataset.id;

            if (id == driveData.getMouseOverFileId()) {
                return;
            }

            const cash = driveData.getCash(id);

            const breads = getBreads(lis, "");
            breads.push({ name: li.textContent, id: id });

            if (cash) {
                const folders = getFolders(id);
                changeMoveButton(folders, id, li.textContent);
                initFolders(folders);
                initBreads(breads);
                return;
            }

            driveImage.getImages(id, function (json) {
                driveData.addCash(id, json);
                const folders = getFolders(id);
                changeMoveButton(folders, id, li.textContent);
                initFolders(folders);
                initBreads(breads);
            });

        });
    }

    function isMove(folders) {

        const fileId = driveData.getMouseOverFileId();

        for (let i = 0, len = folders.length; i < len; i++) {

            if (folders[i].id == fileId) {
                return false;
            }

        }

        return true;
    }

    function changeMoveButton(folders, id, name) {

        const dialog = document.getElementById("moveDialog");
        const move = dialog.getElementsByClassName("confirm")[0];

        if (!isMove(folders)) {
            move.disabled = "disabled";
            move.textContent = "移動";
            return;
        }

        move.disabled = "";
        move.textContent = name + "へ移動";
        move.dataset.id = id;
        return false;
    }

    function initMove(dialog, moveCallback) {

        const move = dialog.getElementsByClassName("confirm")[0];

        move.addEventListener("click", function () {

            const toParentId = move.dataset.id;
            const moveId = driveData.getMouseOverFileId();

            driveImage.moveFile(moveId, parentId, toParentId, function (json) {

                driveData.removeFile(parentId, moveId);
                const cash = driveData.getCash(toParentId);

                if (cash) {

                    const fileLength = cash.data.length;
                    const firstImage = driveData.getFirstImage(parentId);

                    if (firstImage && firstImage.id == moveId) {
                        driveData.removeFirstImage(parentId);
                    }

                    driveData.removeFirstImage(toParentId);
                    driveData.removeCash(toParentId);

                    getMovedImages(toParentId, fileLength, function (json) {
                        driveData.addCash(toParentId, json);
                        dialog.style.display = "none";
                        dialog.classList.remove("dialog_on");
                        driveData.setMouseOverFileId(null);
                        moveCallback();
                    });
                }
            });

        });
    }

    function getMovedImages(toParentId, length, callback) {

        driveImage.getImages(toParentId, function (json) {

            if (json.data.length > length) {
                driveData.addCash(toParentId, json);
                callback();
                return;
            }

            setTimeout(function () {
                getMovedImages(toParentId, length, callback);
            }, 500);

        });
    }

    function initClose(dialog) {

        const close = dialog.getElementsByClassName("close")[0];

        close.addEventListener("click", function () {
            dialog.style.display = "none";
            dialog.classList.remove("dialog_on");
            driveData.setMouseOverFileId(null);
        });

    }

}