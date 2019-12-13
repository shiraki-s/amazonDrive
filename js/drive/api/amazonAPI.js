
function AmazonAPI() {

    let httpRequest = new HttpRequest();

    this.getAuthToken = function (callback) {
        getAuthToken(callback);
    }

    this.getFiles = function (authToken, filter, callback) {
        getFiles(authToken, filter, callback);
    }

    this.getFilesByOffset = function (authToken, json, filter, nextToken, callback) {
        getFilesByOffset(authToken, json, filter, nextToken, callback);
    }

    this.deleteFile = function (authToken, id, callback) {

        const url = "https://www.amazon.co.jp/drive/v1/trash/" + id;

        const json = {
            'resourceVersion': 'V2',
            'ContentType': 'JSON',
            'recurse': 'true',
        };

        const param = {
            method: "PUT",
            contentType: "application/json",
            headers: [
                { name: "Content-Type", value: "application/Json" },
                { name: "Authorization", value: "Bearer " + authToken }
            ],
            querys: JSON.stringify(json),
            responseType: "text"
        }

        httpRequest.request(url, param, function (json) {
            callback(json);
        });

    }

    this.moveFile = function (authToken, id, parentId, toParentId, callback) {

        const url = "https://www.amazon.co.jp/drive/v1/nodes/" + toParentId + "/children";

        const json = {
            'resourceVersion': 'V2',
            'childId': id,
            'fromParent': parentId,
            'ContentType': 'JSON',
            'toParent': toParentId
        };

        const param = {
            method: "POST",
            contentType: "application/json",
            headers: [
                { name: "Content-Type", value: "application/Json" },
                { name: "Authorization", value: "Bearer " + authToken }
            ],
            querys: JSON.stringify(json),
            responseType: "text"
        }

        httpRequest.request(url, param, function (json) {
            callback(json);
        });

    }

    this.changeMetadata = function (authToken, id, querys, callback) {

        const url = "https://www.amazon.co.jp/drive/v1/nodes/" + id;

        const json = {
            'resourceVersion': 'V2',
            'ContentType': 'JSON',
        };

        if (querys.name) {
            json["name"] = querys.name;
        }

        if (querys.labels) {
            json["labels"] = querys.labels;
        }

        const param = {
            method: "PATCH",
            contentType: "application/json",
            headers: [
                { name: "Content-Type", value: "application/Json" },
                { name: "Authorization", value: "Bearer " + authToken }
            ],
            querys: JSON.stringify(json),
            responseType: "text"
        }

        httpRequest.request(url, param, function (json) {
            callback(json);
        });

    }

    this.getFirstFile = function (authToken, filter, callback) {

        getFiles(authToken, filter, function (json) {

            if (json && json.data.length > 0) {
                return callback(json.data[0]);
            }
        });
    }

    function getAuthToken(callback) {

        const url = getAuthUrl();
        const param = {
            method: "GET",
            responseType: "text"
        };

        httpRequest.request(url, param, function (error, text) {

            if (error) {
                console.log(error);
                callback("");
                return;
            }

            const json = JSON.parse(text);
            console.log(json);
            callback(json.access_token);
        });

    }

    function getAuthUrl() {

        return "https://www.amazon.co.jp/clouddrive/auth/token?mgh=1";

        // const src = document.getElementsByTagName("html")[0].innerHTML;
        // let url = src.substring(src.indexOf("authportalUrl") + 16, src.length);
        // url = url.substring(0, url.indexOf('"'));

        // return url;
    }

    // function getFilesByOffset(authToken, id, json, callback) {

    //     const url = "https://www.amazon.co.jp/drive/v1/nodes/";


    //     var j = {
    //         'resourceVersion': 'V2',
    //         'ContentType': 'JSON',
    //         'asset': 'ALL',
    //         'limit': '200',
    //         'offset': json.data.length,
    //         'sort': '["kind DESC","name ASC"]',
    //         'tempLink': 'true',
    //         'filters': 'parents:' + id + ' AND kind:(FILE* OR FOLDER*)'
    //     };

    //     const param = {
    //         method: "GET",
    //         headers: [
    //             { name: "Content-Type", value: "application/Json" },
    //             { name: "Authorization", value: "Bearer " + authToken }
    //         ],
    //         responseType: "text"
    //     }

    //     httpRequest.request(createUrl(url, j), param, function (error, text) {

    //         if (error) {
    //             console.log(error);
    //             callback(null);
    //             return;
    //         }

    //         const resJson = JSON.parse(text);

    //         Array.prototype.push.apply(json.data, resJson.data);

    //         if (json.data.length < json.count) {
    //             getFilesByOffset(authToken, id, json, callback);
    //         } else {
    //             callback(json);
    //         }

    //     });
    // }

    function getFiles(authToken, filter, callback) {

        let url = "https://www.amazon.co.jp/drive/v1/nodes/";

        const json = {
            'resourceVersion': 'V2',
            'ContentType': 'JSON',
            'asset': 'ALL',
            'limit': '200',
            'sort': '["kind DESC","name ASC"]',
            'tempLink': 'true',
            'filters': filter
            // 'filters': 'parents:' + id + ' AND kind:(FILE* OR FOLDER*)'
        };
        const param = {
            method: "GET",
            headers: [
                { name: "Content-Type", value: "application/Json" },
                { name: "Authorization", value: "Bearer " + authToken }
            ],
            responseType: "text"
        }

        httpRequest.request(createUrl(url, json), param, function (error, text) {

            if (error) {

                console.log(error);

                getAuthToken(function (token) {
                    authToken = token;
                    callback(null);
                });

                return;
            }

            callback(JSON.parse(text));

        });
    }

    function getFilesByOffset(authToken, json, filter, nextToken, callback) {

        const url = "https://www.amazon.co.jp/drive/v1/nodes/";

        var j = {
            'resourceVersion': 'V2',
            'ContentType': 'JSON',
            'asset': 'ALL',
            'limit': '200',
            'startToken': nextToken,
            // 'offset': json.data.length,
            'sort': '["kind DESC","name ASC"]',
            'tempLink': 'true',
            'filters': filter

            // 'filters': 'parents:' + id + ' AND kind:(FILE* OR FOLDER*)'
        };

        const param = {
            method: "GET",
            headers: [
                { name: "Content-Type", value: "application/Json" },
                { name: "Authorization", value: "Bearer " + authToken }
            ],
            responseType: "text"
        }

        httpRequest.request(createUrl(url, j), param, function (error, text) {

            if (error) {
                console.log(error);
                callback(null);
                return;
            }

            const resJson = JSON.parse(text);

            Array.prototype.push.apply(json.data, resJson.data);

            if (json.data.length < json.count) {

                if (json.count > 10000) {

                    setTimeout(function () {
                        getFilesByOffset(authToken, json, filter, resJson.nextToken, callback);
                    }, 500);
                    return;
                }

                getFilesByOffset(authToken, json, filter, resJson.nextToken, callback);

            } else {
                callback(json);
            }

        });

    }

    function createUrl(baseUrl, queryJson) {

        var i = 0;
        var url = baseUrl;

        for (var key in queryJson) {

            if (i == 0) {
                url = url + "?" + key + "=" + queryJson[key];
            } else {
                url = url + "&" + key + "=" + queryJson[key];
            }

            i++;
        }

        return url;

    }
}

