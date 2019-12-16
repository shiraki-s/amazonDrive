

function DownloadImage(driveData, progressManager) {

    const driveImage = new DriveImage(driveData);
    const downloader = new Downloader();

    this.download = function (file, callback) {

        if (file.kind == "FILE") {

            const items = createDownloadItems([file]);

            downloader.downloadByParallel(items, 1, function () {

            }, function (results) {
                const imageData = new Uint8Array(results[0].data);
                let extention = file.contentProperties.extention;

                if (extention == "jpg") {
                    extention = "jpeg";
                }

                const blob = new Blob([imageData], { type: "image/" + extention });
                saveAs(blob, results[0].name, { type: "image/" + extention });
                callback();
            });

            return;
        }

        if (file.kind == "FOLDER") {

            progressManager.view(function () {
                progressManager.close();
            });

            getDirFiles(file.id, function (files) {

                const items = createDownloadItems(files);

                if (items.length == 0) {
                    console.log("画像なし");
                    callback();
                    return;
                }

                let max = 5;

                if (items.length <= 5) {
                    max = 1;
                }

                let count = 0;

                downloader.downloadByParallel(items, max, function () {
                    progressManager.update(++count / items.length);
                }, function (results) {
                    downloadZip(file.name, results);
                    callback();
                });

            });

        }

    }

    function downloadZip(name, results) {

        var zip = new JSZip();
        const error = [];

        for (let i = 0, len = results.length; i < len; i++) {

            if (results[i].data) {
                zip.file(results[i].name, results[i].data, { binary: true });
            } else {
                error.push(results);
            }

        }

        console.log(error);

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, name + ".zip", { type: "application/zip" });
            });
    }

    function createDownloadItems(files) {

        const items = [];

        for (let i = 0, len = files.length; i < len; i++) {

            if (files[i].kind == "FOLDER" || !files[i].contentProperties.image) {
                continue;
            }

            const name = files[i].name;
            const url = files[i].originalUrl;
            items.push({ name: name, url: url, type: "arraybuffer" });

        }

        return items;

    }

    function getDirFiles(id, callback) {

        const cash = driveData.getCash(id);

        if (cash) {
            callback(cash.data);
            return;
        }

        driveImage.getImages(id, function (json) {
            callback(json.data);
        });

    }

}