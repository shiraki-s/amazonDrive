
function ProgressManager() {

    var bar;

    this.init = function () {
    }

    this.close = function () {
        // const container = document.getElementById("progressBar");
        // container.classList.add("bar_close");
    }

    this.view = function (endCallback) {

        const div = document.createElement("div");
        div.id = "progressBar";

        const body = document.getElementsByTagName("body")[0];
        body.appendChild(div);

        const container = document.getElementById("progressBar");
        container.classList.remove("bar_close");

        bar = new ProgressBar.Line(container, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: { color: '#FFEA82' },
            to: { color: '#ED6A5A' },
            step: (state, bar) => {

                if (bar && bar.value() == 1.0) {
                    body.removeChild(div);
                    endCallback();
                    bar = null;
                }
            }
        });

    }

    this.update = function (value) {

        if (bar) {
            bar.set(value);
        }
    }

    this.updateText = function (text) {

        if (bar) {
            bar.setText(text);
        }
    }

}