
function CreateHeader() {

    const createHeaderElement = new CreateHeaderElement();

    this.createHeader = function (width) {
        const header = createHeaderElement.createHeader();
        header.style.width = width + "px";
        return header;
    }

    this.createBread = function (id, name, callback) {
        const bread = createHeaderElement.createBread(id, name);
        initClickBread(bread, callback);
        return bread;
    }

    function initClickBread(bread, callback) {

        bread.addEventListener("click", function () {
            const a = bread.getElementsByTagName("a")[0];
            const id = a.dataset.id;
            callback(id);
        });
    }

}