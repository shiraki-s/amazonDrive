
function DriveImage(driveData) {

    const amazonAPI = new AmazonAPI();

    this.getImages = function (id, callback) {

        const filter = 'parents:' + id + ' AND kind:(FILE* OR FOLDER*)';

        if (isAuthTokenLimit()) {

            refreshToken(function () {
                getImages(filter, callback);
            });

            // location.reload();
            return;
        }

        getImages(filter, callback);

    }

    this.searchImages = function (filter, callback) {

        if (isAuthTokenLimit()) {

            refreshToken(function () {
                getImages(filter, callback);
            });
            // location.reload();
            return;
        }

        getImages(filter, callback);

    }


    this.getAllImages = function (callback) {

        const filter = "kind:FILE";

        if (isAuthTokenLimit()) {

            refreshToken(function () {
                getImages(filter, callback);
            });
            // location.reload();
            return;
        }

        getImages(filter, callback);

    }

    this.getFirstFile = function (id, callback) {

        const filter = 'parents:' + id + ' AND kind:(FILE* OR FOLDER*)';

        if (isAuthTokenLimit()) {

            refreshToken(function () {
                getImages(filter, callback);
            });
            // location.reload();
            return;
        }

        getFirstFile(filter, callback);
    }

    this.deleteFile = function (id, callback) {


        if (isAuthTokenLimit()) {

            refreshToken(function () {
                const authToken = driveData.getAuthToken();
                amazonAPI.deleteFile(authToken, id, callback);
            });
            // location.reload();
            return;
        }

        const authToken = driveData.getAuthToken();
        amazonAPI.deleteFile(authToken, id, callback);
    }

    this.moveFile = function (id, parentId, toParentId, callback) {

        if (isAuthTokenLimit()) {
            // location.reload();
            refreshToken(function () {
                const authToken = driveData.getAuthToken();
                amazonAPI.moveFile(authToken, id, parentId, toParentId, callback);
            });

            return;
        }

        const authToken = driveData.getAuthToken();
        amazonAPI.moveFile(authToken, id, parentId, toParentId, callback);
    }

    this.changeMetadata = function (id, querys, callback) {

        if (isAuthTokenLimit()) {
            // location.reload();
            refreshToken(function () {
                const authToken = driveData.getAuthToken();
                amazonAPI.changeMetadata(authToken, id, querys, callback);
            });

            return;
        }


        const authToken = driveData.getAuthToken();
        amazonAPI.changeMetadata(authToken, id, querys, callback);
    }

    function refreshToken(callback) {

        amazonAPI.getAuthToken(function (token) {
            driveData.setAuthToken(token);
            driveData.setAuthTokenLimit();
            callback();
        });

    }

    function getImages(filter, callback) {

        let j = {
            count: 0,
            data: []
        };

        const authToken = driveData.getAuthToken();

        amazonAPI.getFiles(authToken, filter, function (json) {

            if (!json) {
                callback(null);
            }

            Array.prototype.push.apply(j.data, json.data);
            j.count = json.count;

            const length = driveData.getElementLength();

            if (j.count > j.data.length) {

                amazonAPI.getFilesByOffset(authToken, j, filter, json.nextToken, function (json2) {

                    for (let i = 0, len = json2.data.length; i < len; i++) {
                        json2.data[i].imgUrl = createRedirectUrl(json2.data[i].id, length);
                        json2.data[i].originalUrl = createRedirectUrl(json2.data[i].id, 0);
                    }

                    callback(json2);
                });

            } else {

                for (let i = 0, len = j.data.length; i < len; i++) {
                    j.data[i].imgUrl = createRedirectUrl(j.data[i].id, length);
                    j.data[i].originalUrl = createRedirectUrl(j.data[i].id, 0);
                }

                callback(j);
            }
        });

    }

    function getFirstFile(filter, callback) {

        const authToken = driveData.getAuthToken();

        amazonAPI.getFirstFile(authToken, filter, function (file) {

            if (file.kind == "FILE" && file.contentProperties.image) {
                const length = driveData.getElementLength();
                file.imgUrl = createRedirectUrl(file.id, length)
            }

            callback(file);
        });
    }

    function createRedirectUrl(id, size) {

        const time = new Date().getTime();

        if (size <= 0) {

            return "https://www.amazon.co.jp/drive/v1/nodes/" + id + "/contentRedirection?cb=" + time;
        }

        return "https://www.amazon.co.jp/drive/v1/nodes/" + id + "/contentRedirection?querySuffix=%3FviewBox%3D" + size + "&cb=" + time;
    }


    function isAuthTokenLimit() {

        const limit = driveData.getAuthTokenLimit();
        const now = new Date().getTime();

        if (now > limit) {
            return true;
        }

        return false;

    }

}
