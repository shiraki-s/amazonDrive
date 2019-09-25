
function CreateHeaderElement() {

    const generator = new DomGenerator();

    this.createHeader = function () {

        const div2 = generator.create({
            tagName: "ul",
            classes: ["breadcrumbs", "folder-path"]

        });

        const div = generator.create({
            tagName: "div",
            classes: ["breadcrumb-column"],
            children: [div2]
        });

        return div;
    }

    this.createBread = function (id, name) {

        const a = generator.create({
            tagName: "a",
            attributes: [
                { name: "href", value: "javascript:void(0)" },
                { name: "data-id", value: id }
            ],
            classes: ["bread"],
            text: name
        });

        return generator.create({
            tagName: "li",
            children: [a]
        });

    }

}