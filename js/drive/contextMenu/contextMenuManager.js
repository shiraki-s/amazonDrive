
function ContextMenuManager(driveData) {

    const progressManager = new ProgressManager();
    const driveImage = new DriveImage(driveData);
    const moveDialog = new MoveDialog(driveData);
    const tagDialog = new TagDialog(driveData);
    const uploadGoogle = new UploadGoogle(driveData, progressManager);
    const downloadImage = new DownloadImage(driveData, progressManager);
    let deleteCallback;
    let changeNameCallback;

    this.init = function (_deleteCallback, _moveCallback, _changeNameCallback, _changeTagCallback) {

        deleteCallback = _deleteCallback;
        changeNameCallback = _changeNameCallback;
        createDom(_moveCallback, _changeTagCallback);
        progressManager.init();

        document.addEventListener("contextmenu", function (e) {

            e.preventDefault();
            createMenu();

            return;

        });

        document.addEventListener("click", function (e) {

            const menu = document.getElementById('contextmenu');

            if (isExistClass(menu.classList, "menu_on")) {

                e.preventDefault();
                // driveData.setMouseOverFileId(null);
                menu.style.display = "none";
                menu.classList.remove("menu_on");
                return;
            }

        });

    }

    function createMenu() {

        const menu = document.getElementById('contextmenu');
        const dialog = document.getElementById("tagModal");

        if (driveData.isKeyEvent() || !driveData.getMouseOverFileId() ||
            isExistClass(dialog.classList, "modal_on")) {
            menu.style.display = "none";
            menu.classList.remove("menu_on");
            return;
        }

        menu.style.left = e.pageX + "px";
        menu.style.top = e.pageY - window.pageYOffset + "px";
        menu.style.display = "block";
        menu.classList.add("menu_on");

    }

    function createDom(moveCallback, changeTagCallback) {

        const div = document.createElement("div");
        const ul = document.createElement("ul");

        const del = document.createElement("li");
        del.textContent = "削除";
        initDelete(del);
        ul.appendChild(del);

        const move = document.createElement("li");
        move.textContent = "移動";
        initMove(move);
        ul.appendChild(move);

        const change = document.createElement("li");
        change.textContent = "名前変更";
        initChangeName(change);
        ul.appendChild(change);

        const tag = document.createElement("li");
        tag.textContent = "タグ追加";
        initChangeTag(tag);
        ul.appendChild(tag);

        const upload = document.createElement("li");
        upload.textContent = "googlePhotoにアップロード";
        initUpload(upload);
        ul.appendChild(upload);

        const download = document.createElement("li");
        download.textContent = "ダウンロード"
        initDownload(download);
        ul.appendChild(download);

        div.appendChild(ul);
        div.id = "contextmenu";

        document.getElementsByTagName("body")[0].appendChild(div);
        moveDialog.init(moveCallback);
        tagDialog.init(changeTagCallback);
    }

    function initDelete(li) {

        li.addEventListener("click", function () {

            const id = driveData.getMouseOverFileId();

            if (!id) {
                return;
            }

            driveImage.deleteFile(id, function (json) {

                const file = getFile(id);

                if (!file) {
                    driveData.setMouseOverFileId(null);
                    deleteCallback(id);
                    return;
                }

                driveData.removeFile(file.parents[0], id);
                const firstImage = driveData.getFirstImage(file.parents[0]);

                if (firstImage && firstImage.id == id) {
                    driveData.removeFirstImage(file.parents[0]);
                }

                driveData.setMouseOverFileId(null);
                deleteCallback(id);
            });

        });

    }

    function initMove(li) {

        li.addEventListener("click", function () {
            moveDialog.view();
        });
    }

    function initChangeName(li) {

        li.addEventListener("click", function () {

            const id = driveData.getMouseOverFileId();
            const file = getFile(id);
            let name = "";

            if (file) {
                name = file.name;
            }

            const text = prompt("新しい名前を入力してください", name);

            if (!text || (file && file.name == text)) {
                return;
            }

            const querys = { name: text };

            driveImage.changeMetadata(id, querys, function (json) {
                file.name = text;
                console.log(json);
                driveData.setMouseOverFileId(null);
                changeNameCallback();

            });
        });

    }

    function initChangeTag(li) {

        li.addEventListener("click", function () {
            tagDialog.view();
        });

    }

    function initUpload(li) {

        li.addEventListener("click", function () {
            const id = driveData.getMouseOverFileId();
            const file = getFile(id);

            uploadGoogle.uploadImage(file, function () {
                console.log("完了");
            });
        });

    }

    function initDownload(li) {

        li.addEventListener("click", function () {
            const id = driveData.getMouseOverFileId();
            const file = getFile(id);

            downloadImage.download(file, function () {
                console.log("完了");
            });
        });

    }

    function getFile(id) {

        const elements = document.getElementsByClassName("element");
        let parentId;

        for (let i = 0, len = elements.length; i < len; i++) {

            if (elements[i].dataset.id == id) {
                parentId = elements[i].dataset.parentId;
            }

        }

        if (!parentId) {
            return null;
        }

        const cash = driveData.getCash(parentId);

        for (let i = 0, len = cash.data.length; i < len; i++) {

            if (cash.data[i].id == id) {
                return cash.data[i];
            }

        }

        return null;

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