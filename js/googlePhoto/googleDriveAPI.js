
function GoogleDriveAPI() {

    const request = new HttpRequest();
    const BASE_URL = "https://www.googleapis.com/drive/v3/";

    this.getList = function (token, callback) {

        const url = BASE_URL + "files";

        const params = {

            method: "GET",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }]
        };

        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
            }

            callback(json.json);
        });

    }

    this.getFile = function (token, id, callback) {

        const url = BASE_URL + "files/" + id;

        const params = {

            method: "GET",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            querys: [
                { key: "alt", value: "media" }
            ]
        };

        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
            }

            callback(json.json);
        });

    }

    this.updateFile = function (token, id, uploadType, content, callback) {

        const url = "https://www.googleapis.com/upload/drive/v2/files/" + id;

        const params = {

            method: "PUT",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            contentType: "application/octet-stream",
            querys: [
                { key: "uploadType", value: uploadType }
            ],
            binary: JSON.stringify(content)
        };

        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
            }

            callback(json.json);
        });

    }

    this.updateText = function () {

    }
}