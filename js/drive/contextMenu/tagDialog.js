
function TagDialog(driveData) {

    const createDialog = new CreateTagDialogElement();
    const driveImage = new DriveImage(driveData);
    let changeTagCallback;

    this.init = function (_changeTagCallback) {

        changeTagCallback = _changeTagCallback;
        const dialog = createDialog.create();
        initOk(dialog);
        initClose(dialog);

        const body = document.getElementsByTagName("body")[0];
        body.appendChild(dialog);
    }

    this.view = function () {

        const dialog = document.getElementById("tagModal");
        const input = dialog.getElementsByTagName("input")[0];
        input.value = "";

        setTags(input);
        dialog.classList.add("modal_on");
        dialog.showModal();
    }

    function setTags(input) {

        const id = driveData.getMouseOverFileId();
        const elements = document.getElementsByClassName("element");

        for (let i = 0, len = elements.length; i < len; i++) {

            if (elements[i].dataset.id == id) {
                const file = getFile(id);

                if (file && file.labels.length > 0) {

                    let text = "";

                    for (let i = 0, len = file.labels.length; i < len; i++) {

                        if (i == file.labels.length - 1) {
                            text = text + file.labels[i];
                            continue;
                        }

                        text = text + file.labels[i] + ",";
                    }

                    input.value = text;
                    return;
                }

            }

        }

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

    function initOk(dialog) {

        const ok = dialog.getElementsByClassName("ok")[0];

        ok.addEventListener("click", function () {

            const input = dialog.getElementsByTagName("input")[0];

            if (input.value) {

                const id = driveData.getMouseOverFileId();
                const file = getFile(id);
                const labels = input.value.split(",");
                const querys = { labels: labels };

                driveImage.changeMetadata(file.id, querys, function (json) {
                    file.labels = labels;
                    console.log(json);
                    dialog.classList.remove("modal_on");
                    dialog.close();
                    driveData.setMouseOverFileId(null);
                    changeTagCallback();
                });

                return;
            }

            dialog.classList.remove("modal_on");
            dialog.close();
        });
    }

    function initClose(dialog) {

        const cancel = dialog.getElementsByClassName("cancel")[0];

        cancel.addEventListener("click", function () {
            dialog.classList.remove("modal_on");
            dialog.close();
        });
    }
}