
function CreateTagDialogElement() {

    const generator = new DomGenerator();

    this.create = function () {

        const footer = createFooter();

        const body = generator.create({
            tagName: "div",
            classes: ["modal-body"],
            children: [createBody()],
        });

        const h3 = generator.create({
            tagName: "h3",
            classes: ["modal-header"],
            text: "タグを追加する"
        });

        const dialog = generator.create({
            tagName: "dialog",
            children: [h3, body, footer]
        });

        dialog.id = "tagModal";
        return dialog;
    }

    function createBody() {

        return generator.create({
            tagName: "input",
            attributes: [{ name: "type", value: "text" }],
        });

    }

    function createFooter() {

        const ok = generator.create({
            tagName: "button",
            classes: ["ok"],
            attributes: [{ name: "type", value: "button" }],
            text: "ok",
        });

        const cancel = generator.create({
            tagName: "button",
            classes: ["cancel"],
            attributes: [{ name: "type", value: "button" }],
            text: "cancel",
        });

        return generator.create({
            tagName: "footer",
            classes: ["modal-footer"],
            children: [ok, cancel],
        });

    }
}