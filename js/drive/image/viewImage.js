
function ViewImage(driveData) {

    const createImg = new CreateImg(driveData);
    let clickCallback;

    this.init = function (_clickCallback) {
        clickCallback = _clickCallback;
        clearStyle();
        calcImageSize();
        initViewContainer();
    }

    this.view = function (data) {

        const el = document.getElementsByClassName("loading-transition")[0];
        clearViewContainer();

        const length = driveData.getElementLength();

        let element;

        if (data) {
            element = createImageElement(data, length);
        } else {
            const cash = driveData.getCash(driveData.getNowDir());
            element = createImageElement(cash.data, length);
        }

        const folderContainer = document.getElementsByClassName("folderContainer")[0];
        folderContainer.appendChild(element.folderFragment);

        const imageContainer = document.getElementsByClassName("imageContainer")[0];
        imageContainer.appendChild(element.imageFragment);

        const fileContainer = document.getElementsByClassName("fileContainer")[0];
        fileContainer.appendChild(element.fileFragment);

        if (element.preFolder) {
            element.preFolder.scrollIntoView(true);
        } else {
            scrollTo(0, 0);
        }

        el.style.overflow = "visible";
        el.style.height = "100vh";
    }

    this.getElement = function (id) {

        const elements = document.getElementsByClassName("element");

        for (let i = 0, len = elements.length; i < len; i++) {

            if (elements[i].dataset.id == id) {
                return elements[i];
            }

        }

    }

    function createImageElement(files, length) {

        const folderFragment = document.createDocumentFragment();
        const imageFragment = document.createDocumentFragment();
        const fileFragment = document.createDocumentFragment();
        let preFolder = null;

        for (let i = 0, len = files.length; i < len; i++) {

            const element = createImg.create(files[i], length, clickCallback);

            if (!element) {
                continue;
            }

            if (isPreFolder(files[i])) {
                preFolder = element;
            }
            if (files[i].kind == "FOLDER") {
                folderFragment.appendChild(element);
                continue;
            }

            if (files[i].kind == "FILE" && files[i].contentProperties.image) {
                imageFragment.appendChild(element);
                continue;
            }

            fileFragment.appendChild(element);
        }

        return {
            folderFragment: folderFragment,
            imageFragment: imageFragment,
            fileFragment: fileFragment,
            preFolder: preFolder
        };
    }

    function isPreFolder(file) {

        if (file.kind != "FOLDER") {
            return false;
        }

        const nowDirName = driveData.getNowDirName();

        if (file.name == nowDirName) {
            return true;
        }

        return false;

    }

    function initViewContainer() {

        const el = document.getElementsByClassName("loading-transition")[0];

        const folderContainer = document.createElement("div");
        folderContainer.classList.add("folderContainer");
        el.appendChild(folderContainer);

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("imageContainer");
        el.appendChild(imageContainer);

        const fileContainer = document.createElement("div");
        fileContainer.classList.add("fileContainer");
        el.appendChild(fileContainer);

    }

    function clearViewContainer() {
        const el = document.getElementsByClassName("loading-transition")[0];
        const folderContainer = el.getElementsByClassName("folderContainer")[0];
        const imageContainer = el.getElementsByClassName("imageContainer")[0];
        const fileContainer = el.getElementsByClassName("fileContainer")[0];
        folderContainer.textContent = null;
        imageContainer.textContent = null;
        fileContainer.textContent = null;
    }

    function clearStyle() {

        const nav = document.getElementsByClassName("side-nav-wrapper")[0];

        if (nav) {
            nav.remove();
            const bodyContent = document.getElementsByClassName("body-content")[0];
            bodyContent.style.marginLeft = "0px";
        }

        const scrollList = document.getElementsByClassName("infinite-scroll-list")[0];

        if (scrollList) {
            scrollList.remove();
        }

        const re2 = document.querySelectorAll(".file-list-item.file-list-node.selectable")[0];

        if (re2) {
            re2.remove();
        }

    }

    function calcImageSize() {

        const element = document.getElementsByClassName("loading-transition")[0];
        driveData.setElementWidth(element.scrollWidth);
        driveData.setElementLength((element.scrollWidth / 4) - 12);

        if (!isInteger(driveData.getElementLength())) {
            driveData.setElementLength(Math.round(driveData.getElementLength()));
        }

    }

    function isInteger(x) {
        return Math.round(x) === x;
    }

}