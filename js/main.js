
function Main() {

    this.run = function () {
        run();

        var script = document.createElement('script');
        script.innerHTML = 'console.log("オラオラ")';
        document.body.appendChild(script);
    }

    function run() {

        const url = "https://us-central1-blog-reader-1371.cloudfunctions.net/amazonDrive?type=manifest";
        let request;

        try {
            request = new HttpRequest();
        } catch (e) {

            setTimeout(function () {
                run();
            }, 500);

            return;
        }

        request.request(url, { method: "GET", responseType: "text" }, function (error, text) {

            console.log(text);
            const json = JSON.parse(text);
            console.log(json);

            const jses = json.text.content_scripts[0].js;
            const csses = json.text.content_scripts[0].css;
            const base = "https://upbeat-mclean-30103c.netlify.com/";
            createCssTag(base, csses);

            createJsTag(base, jses, function () {
                init(base);
            });
        });

    }

    function init(base) {

        try {
            const manager = new DriveManager();

            if (manager.checkLoad()) {
                manager.init(base);
                return;
            }

            setTimeout(function () { init(base) }, 500);

        } catch (e) {
            setTimeout(function () { init(base) }, 500);
        }
    }

    function createCssTag(base, array) {

        const fragment = document.createDocumentFragment();

        for (let i = 0, len = array.length; i < len; i++) {

            const l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = base + "/" + array[i];
            l.type = 'text/css';
            fragment.appendChild(l);
        }

        document.body.appendChild(fragment);
    }

    function createJsTag(base, array, onLoad) {

        const fragment = document.createDocumentFragment();

        for (let i = 0, len = array.length; i < len; i++) {

            const s = document.createElement('script');
            s.src = base + "/" + array[i];
            s.async = false;
            fragment.appendChild(s);

            if (i == array.length - 1) {
                s.onload = onLoad;
            }
        }

        document.body.appendChild(fragment);

    }

}