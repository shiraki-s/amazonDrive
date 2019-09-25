

function CreateMoveDialogElement() {

    const generator = new DomGenerator();

    this.create = function () {

        const button = generator.create({
            tagName: "button",
            attributes: [{ name: "type", value: "button" }],
            classes: ["close"],
        });

        const h1 = generator.create({
            tagName: "h1",
            attributes: [{ name: "title", value: "移動" }],
            classes: ["dialog-head"],
            text: "移動"
        });

        const aside = generator.create({
            tagName: "aside",
            classes: ["dialog", "folder-picker", "with-footer", "with-header"],
            children: [button, h1, createDialogContent(), createFooter()]
        });

        aside.id = "moveDialog";

        return aside;

    }

    this.createBread = function (num, name) {
        return createPathContent(num, name);
    }

    this.createFolder = function (name) {
        return createFolderContent(name);
    }

    function createFooter() {

        const span1 = generator.create({
            tagName: "span",
            text: "移動"
        });

        const button1 = generator.create({
            tagName: "button",
            classes: ["confirm"],
            attributes: [{ name: "disabled", value: "" }],
            children: [span1]
        });

        const span2 = generator.create({
            tagName: "span",
            text: "新規フォルダの作成"
        });

        const button2 = generator.create({
            tagName: "button",
            classes: ["new-folder"],
            children: [span2]
        });

        const div = generator.create({
            tagName: "div",
            children: [button1, button2]
        });

        return generator.create({
            tagName: "footer",
            children: [div]
        });

    }

    function createDialogContent() {

        const ul = createFolderPaths([]);
        const folders = createFolders();

        const div = generator.create({
            tagName: "div",
            classes: ["scroller"],
            children: [ul, folders]
        });

        return generator.create({
            tagName: "div",
            classes: ["dialog-content"],
            children: [div]
        });

    }


    function createFolderPaths(paths) {

        const lis = [];

        for (let i = 0, len = paths.length; i < len; i++) {
            lis.push(createPathContent(i, paths[i].name));
        }

        return generator.create({
            tagName: "ul",
            classes: ["breadcrumbs", "folder-path"],
            children: lis
        });

    }

    function createPathContent(num, name) {

        const a = generator.create({
            tagName: "a",
            attributes: [{ name: "href", value: "javascript:void(0)" }],
            classes: ["breadcrumbs-link" + num],
            text: name
        });

        return generator.create({
            tagName: "li",
            children: [a]
        });

    }

    function createFolders() {

        const span1 = generator.create({
            tagName: "span",
            classes: ["node-icon"],
        });

        const span2 = generator.create({
            tagName: "span",
        });

        const span3 = generator.create({
            tagName: "span",
            classes: ["detail", "FileName"],
            children: [span1, span2]
        });

        const li = generator.create({
            tagName: "li",
            classes: ["file-list-item", "placeholder"],
            children: [span3]
        });

        const ul = generator.create({
            tagName: "ul",
            classes: ["list-layout"],
            children: [li]
        });

        const div1 = generator.create({
            tagName: "div",
            classes: ["page", "placeholder", "hidden"],
            children: [ul]
        });

        const div2 = generator.create({
            tagName: "div",
            classes: ["infinite-scroll-list"],
            children: [div1, createFolderContents([])]
        });

        return generator.create({
            tagName: "div",
            classes: ["loading-transition"],
            children: [div2]
        });

    }

    function createFolderContents(files) {

        const lis = [];

        for (let i = 0, len = files.length; i < len; i++) {
            lis.push(createFolderContent(files[i].name));
        }

        const ul = generator.create({
            tagName: "ul",
            classes: ["list-layout"],
            children: lis
        });

        return generator.create({
            tagName: "div",
            classes: ["page"],
            children: [ul]
        });
    }

    function createFolderContent(name) {

        const span1 = generator.create({
            tagName: "span",
            classes: ["node-icon", "folder"],
        });

        const span2 = generator.create({
            tagName: "span",
            attributes: [{ name: "title", value: name }],
            text: name
        });

        const span3 = generator.create({
            tagName: "span",
            classes: ["detail", "FileName"],
            children: [span1, span2]
        });

        return generator.create({
            tagName: "li",
            classes: ["file-list-item", "file-list-node"],
            children: [span3]
        });
    }

}