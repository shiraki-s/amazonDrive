
function CreateSearchElement() {

    const generator = new DomGenerator();

    this.create = function (width) {

        const options = [];

        const option1 = generator.create({
            tagName: "option",
            attributes: [
                { name: "value", value: "name" },
            ],
            text: "名前"
        });

        const option2 = generator.create({
            tagName: "option",
            attributes: [
                { name: "value", value: "label" },
            ],
            text: "ラベル"
        });

        options.push(option1);
        options.push(option2);

        const select = generator.create({
            tagName: "select",
            attributes: [
                { name: "name", value: "type" },
            ],
            children: options
        });

        const input = generator.create({
            tagName: "input",
            attributes: [
                { name: "type", value: "text" },
                { name: "name", value: "searchInput" },
                { name: "title", value: "Amazon Driveを検索" },
                { name: "placeholder", value: "Amazon Driveを検索" },
            ],
            classes: ["search-field"],
        });

        const button = generator.create({
            tagName: "button",
            classes: ["search-submit"],
            attributes: [
                { name: "title", value: "検索" },
            ],
        });

        const form = generator.create({
            tagName: "form",
            classes: ["search-field"],
            children: [select, input, button]
        });

        form.style.padding = "10px";
        form.style.display = "flex";
        form.style.width = width + "px";

        return generator.create({
            tagName: "div",
            children: [form]
        });

    }
}