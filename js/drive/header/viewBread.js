
function ViewBread(driveData) {

    const createHeader = new CreateHeader();
    const searchManager = new SearchManager(driveData);
    const SEARCH_WIDTH = 500;
    let clickCallback;

    this.init = function (callback, _clickCallback, _searchCallback) {
        clickCallback = _clickCallback;
        initHeader(callback, _searchCallback);
    }

    this.view = function () {

        const nowDir = driveData.getNowDir();
        const nowDirName = driveData.getNowDirName();
        const breads = getBreads();

        for (let i = 0, len = breads.length; i < len; i++) {

            if (breads[i].id == nowDir) {
                removeBread(i);
                return;
            }

        }

        addBread(nowDir, nowDirName);

    }

    function initHeader(callback, searchCallback) {

        initBreads(function (id, name, breadElements) {
            removeHeader();

            const header = document.getElementById("primary-header");
            header.textContent = null;

            const headerElement = createHeader.createHeader(header.clientWidth - SEARCH_WIDTH);
            const ul = headerElement.getElementsByTagName("ul")[0];
            ul.appendChild(breadElements);
            header.appendChild(headerElement);
            searchManager.init(SEARCH_WIDTH, searchCallback);
            callback(id, name);
        });
    }

    function initBreads(callback) {

        setTimeout(function () {

            const breadCrumbs = document.querySelectorAll(".breadcrumbs.folder-path")[0];
            const lis = breadCrumbs.getElementsByTagName("li");

            if (lis.length <= 1) {
                initBreads(callback);
                return;
            }

            const breads = getBreads();
            const fragment = document.createDocumentFragment();

            for (let i = 0, len = breads.length; i < len; i++) {
                const id = breads[i].id;
                const name = breads[i].name;
                fragment.appendChild(createHeader.createBread(id, name, clickCallback));

            }

            callback(breads[breads.length - 1].id, breads[breads.length - 1].name, fragment);

        }, 100)

    }

    function removeBread(index) {

        while (true) {

            const breadCrumbs = document.querySelectorAll(".breadcrumbs.folder-path")[0];
            const lis = breadCrumbs.getElementsByTagName("li");

            if (lis.length == index + 1) {
                return;
            }

            breadCrumbs.removeChild(lis[lis.length - 1]);

        }
    }

    function addBread(id, name) {

        const breadCrumbs = document.querySelectorAll(".breadcrumbs.folder-path")[0];

        const bread = createHeader.createBread(id, name, clickCallback);
        breadCrumbs.appendChild(bread);
    }

    function getBreads() {

        const breadCrumbs = document.querySelectorAll(".breadcrumbs.folder-path")[0];
        const lis = breadCrumbs.getElementsByTagName("li");

        let array = [];

        for (let i = 0, len = lis.length; i < len; i++) {

            const a = lis[i].getElementsByTagName("a")[0];

            if (a && !isExistClass(a.classList, "count")) {

                let id = a.dataset.id;

                if (!id) {
                    id = a.href;
                    id = id.substring(id.indexOf('folder/') + 7, id.length);
                    id = id.substring(0, id.indexOf('?'));
                }

                array.push({
                    id: id,
                    name: a.textContent
                });
            }
        }

        return array;

    }

    function removeHeader() {

        document.getElementById("dialog-container").textContent = null;
        document.getElementsByClassName("breadcrumb-actions")[0].remove();
        document.querySelectorAll(".file-list-item.header")[0].remove();

        const divs = document.getElementsByTagName("div");

        for (let i = 0, len = divs.length; i < len; i++) {
            divs[i].style.display = "";
        }

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