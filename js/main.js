function Main() {

    let jsCount = 0;

    this.run = function () {
        run();
    }

    function run() {

        const base = "https://api.github.com/repos/shiraki-s/amazonDrive/contents/";

        request(base + "manifest.json", function (text) {

            const json = JSON.parse(text);
            const decode = decodeURIComponent(escape(window.atob(json.content)));
            const json2 = JSON.parse(decode);

            const jses = json2.content_scripts[0].js;
            const csses = json2.content_scripts[0].css;
            createCssTag(base, csses);

            createJsTag(base, jses, function (script) {
                init(base, script, jses.length);
            });
        });

    }

    function init(base, script, max) {

        setTimeout(function () {

            if (max == jsCount) {

                const s = document.createElement('script');
                s.innerHTML = script + ' new DriveManager().init("' + base + '");';
                document.body.appendChild(s);

            } else {
                init(base, script, max);
            }


        }, 500);

    }

    function createCssTag(base, array) {

        for (let i = 0, len = array.length; i < len; i++) {

            request(base + array[i], function (text) {
                const json = JSON.parse(text);
                const decode = decodeURIComponent(escape(window.atob(json.content)));

                const style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = decode;
                document.body.appendChild(style);
            });

        }

    }

    function createJsTag(base, array, onLoad) {

        for (let i = 0, len = array.length; i < len; i++) {

            const index = i;

            request(base + array[i], function (text) {

                jsCount++;
                const json = JSON.parse(text);
                const decode = decodeURIComponent(escape(window.atob(json.content)));

                if (index == array.length - 1) {
                    onLoad(decode);
                    return;
                }

                const s = document.createElement('script');
                s.innerHTML = decode;
                document.body.appendChild(s);
            });

        }

    }

    function request(url, callback) {

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {

            if (request.readyState == 4) {

                if (request.status == 200) {
                    callback(request.responseText);
                    return;
                }
            }

        }

        request.open("GET", url, true);
        request.send();
    }

}

