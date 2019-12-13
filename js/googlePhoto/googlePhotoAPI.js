
function GooglePhotoAPI() {

    const request = new HttpRequest();
    const BASE_URL = "https://photoslibrary.googleapis.com/v1/";


    this.createAlbum = function (token, title, callback) {

        const url = BASE_URL + "albums";
        const querys = {
            album: {
                title: title
            }
        }

        const params = {
            method: "POST",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            contentType: "application/json",
            querys: JSON.stringify(querys)
        };

        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
                return;
            }

            callback(json.json);
        });

    }

    this.addMedia = function (token, data, title, callback) {

        const url = BASE_URL + "uploads";

        const params = {
            method: "POST",
            headers: [
                { name: "Authorization", value: "Bearer " + token },
                { name: "X-Goog-Upload-Protocol", value: "raw" },
                { name: "X-Goog-Upload-File-Name", value: title }
            ],
            responseType: "text",
            contentType: "application/octet-stream",
            binary: data
        };

        request.request(url, params, function (error, text) {

            if (error) {
                console.log(error);
                callback("");
                return;
            }

            callback(text);
        });

    }

    this.addMediaToAlbum = function (token, uploads, albumId, callback) {

        const url = BASE_URL + "mediaItems:batchCreate";
        const items = [];

        for (let i = 0, len = uploads.length; i < len; i++) {

            const item = {
                description: uploads[i].description,
                simpleMediaItem: {
                    uploadToken: uploads[i].token
                }
            }

            items.push(item);
        }

        const json = {
            albumId: albumId,
            newMediaItems: items
        };

        const params = {
            method: "POST",
            headers: [
                { name: "Authorization", value: "Bearer " + token },
            ],
            contentType: "application/json",
            querys: JSON.stringify(json)
        };


        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
                return;
            }

            callback(json.json);
        });

    }

    this.getAlbums = function (token, callback) {

        const url = BASE_URL + "albums";

        const params = {

            method: "GET",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            querys: [
                {
                    key: "pageSize",
                    value: 50
                }
            ]
        };

        chrome.runtime.sendMessage({ url: url, params: params }, function (result) {
            const json = JSON.parse(result);

            if (json.error) {
                console.log(json.error);
                callback([]);
                return;
            }

            callback(json.json);
        });
    }

    function getAlbums(token, callback) {

        const url = BASE_URL + "albums";

        const params = {

            method: "GET",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            querys: [
                {
                    key: "pageSize",
                    value: 50
                }
            ]
        };

        request.request(url, params, function (error, json) {

            if (error) {
                console.log(error);
                callback({});
                return;
            }

            callback(json);
        });


    }

    this.searchMedias = function (token, id, callback) {

        const url = BASE_URL + "mediaItems:search";

        const params = {

            method: "POST",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }],
            querys: [
                { key: "albumId", value: id },
                { key: "pageSize", value: 100 }
            ]
        };

        request.request(url, params, function (error, json) {

            if (error) {
                console.log(error);
                callback({});
                return;
            }

            callback(json);
        });

    }

    this.getMedia = function (token, url, callback) {

        const params = {
            method: "GET",
            headers: [{
                name: "Authorization",
                value: "Bearer " + token
            }]
        };

        request.request(url, params, function (error, json) {

            if (error) {
                console.log(error);
                callback({});
                return;
            }

            callback(json);
        });

    }


}