
function SearchManager(driveData) {

    const createElement = new CreateSearchElement();
    const driveImage = new DriveImage(driveData);
    const ENTER = 13;
    let searchCallback;

    this.init = function (width, _searchCallback) {

        searchCallback = _searchCallback;
        const header = document.getElementById("primary-header");
        const element = createElement.create(width);
        initSubmit(element);
        header.appendChild(element);
    }

    function initSubmit(element) {

        const input = element.getElementsByTagName("input")[0];
        const button = element.getElementsByTagName("button")[0];

        input.addEventListener("keydown", function (e) {

            if (e.keyCode == ENTER) {
                e.preventDefault();
                const select = element.getElementsByTagName("select")[0];
                const value = input.value;
                searchImages(select.value, value);
                input.value = "";
            }

        });

        button.addEventListener("click", function (e) {
            const select = element.getElementsByTagName("select")[0];
            const value = input.value;
            searchImages(select.value, value);
            input.value = "";
            e.preventDefault();
        });
    }

    function searchImages(type, text) {

        let filter = "";

        if (type == "name") {
            filter = "name:" + text;
        }

        if (type == "label") {
            filter = "labels:" + text;
        }

        if (!filter) {
            return;
        }

        driveImage.searchImages(filter, function (json) {
            console.log(json);
            searchCallback(json);
        });
    }
}