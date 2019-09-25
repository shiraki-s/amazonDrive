
function DomGenerator() {

    this.create = function (element) {

        if (element.tagName) {

            const dom = document.createElement(element.tagName);

            if (element.classes) {

                for (let i = 0, len = element.classes.length; i < len; i++) {
                    dom.classList.add(element.classes[i]);
                }
            }

            if (element.attributes) {

                for (let i = 0, len = element.attributes.length; i < len; i++) {
                    const attr = element.attributes[i];
                    dom.setAttribute(attr.name, attr.value);
                }
            }

            if (element.text) {
                dom.appendChild(document.createTextNode(element.text));
            }


            if (element.children) {

                for (let i = 0, len = element.children.length; i < len; i++) {
                    const child = element.children[i];
                    dom.appendChild(child);
                }
            }

            if (element.innerHTML) {
                dom.innerHTML = element.innerHTML;
            }

            if (element.insertHTML) {
                dom.insertAdjacentHTML("afterbegin",element.insertHTML);
            }

            if (element.src) {
                dom.src = element.src;
            }

            if (element.events) {

                for (let i = 0, len = element.events.length; i < len; i++) {
                    const event = element.events[i];
                    dom.addEventListener(event.type, event.listener);
                }

            }

            return dom;
        }

        return null;
    }
}