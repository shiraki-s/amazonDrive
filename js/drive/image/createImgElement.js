
function CreateImgElement(driveData) {

    const generator = new DomGenerator();
    const FOLDER = "https://user-images.githubusercontent.com/23305275/65570932-cf29e680-df9d-11e9-91b5-0ed40d36ee27.jpg";
    const FILE = "https://user-images.githubusercontent.com/23305275/65570975-f84a7700-df9d-11e9-872e-22302e3ef4cc.jpg";

    this.createFolder = function (file, length) {

        const img = generator.create({
            tagName: "img",
            attributes: [
                { name: "src", value: FOLDER },
                { name: "width", value: length }
            ]
        });

        const h2 = generator.create({
            tagName: "h2",
            classes: ["title"],
            text: file.name
        });

        const meta = generator.create({
            tagName: "meta",
            attributes: [
                { name: "name", value: "path" },
                { name: "content", value: file.id }
            ],
        });

        const element = generator.create({
            tagName: "div",
            classes: ["folder", "element"],
            children: [img, h2, meta]
        });

        element.style.width = length + "px";
        element.style.height = length + "px";
        return element;

    }

    this.createImage = function (file, length) {

        const wh = file.contentProperties.image;
        const size = wh.width + "x" + wh.height;

        const img = generator.create({
            tagName: "img",
            attributes: [
                { name: "src", value: file.imgUrl },
                { name: "alt", value: file.name }
            ],
        });

        const a = generator.create({
            tagName: "a",
            attributes: [
                { name: "href", value: file.originalUrl },
                { name: "data-size", value: size }
            ],
            children: [img]
        });

        const caption = generator.create({
            tagName: "figcaption",
            text: file.name
        });

        const element = generator.create({
            tagName: "figure",
            classes: ["element"],
            children: [a, caption]
        });

        element.style.width = length + "px";
        element.style.height = length + "px";
        return element;
    }

    this.createFile = function (file, length) {

        const img = generator.create({
            tagName: "img",
            attributes: [
                { name: "src", value: FILE },
                { name: "width", value: length }
            ]
        });

        const h2 = generator.create({
            tagName: "h2",
            classes: ["title"],
            text: file.name
        });

        const meta = generator.create({
            tagName: "meta",
            attributes: [
                { name: "name", value: "path" },
                { name: "content", value: file.id }
            ],
        });

        const element = generator.create({
            tagName: "div",
            classes: ["file", "element"],
            children: [img, h2, meta]
        });

        element.style.width = length + "px";
        element.style.height = length + "px";
        return element;

    }

    this.createWhiteSpace = function (width, height) {

        const space = generator.create({
            tagName: "div",
            attributes: [{ name: "id", value: "space" }]
        });

        space.style.width = width + "px";
        space.style.height = height + "px";

        return space;
    }

    function createRedirectUrl(id, size) {

        const time = new Date().getTime();

        if (size <= 0) {

            return "https://www.amazon.co.jp/drive/v1/nodes/" + id + "/contentRedirection?cb=" + time;
        }

        return "https://www.amazon.co.jp/drive/v1/nodes/" + id + "/contentRedirection?querySuffix=%3FviewBox%3D" + size + "&cb=" + time;
    }

}