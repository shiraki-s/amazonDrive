
function UploadGoogle(driveData, progressManager) {

    let token = {};
    let albums = [];
    let jsonId = "";
    let names = [];
    let isUpdateNameArray = false;
    const NAME_JSON = "name.json";
    const imgCryptor = new ImgCryptor();
    const resizeImg = new ResizeImg();
    const request = new HttpRequest();
    const hashids = new Hashids.default('gazouViewer', 6);
    const googlePhotoAPI = new GooglePhotoAPI();
    const googleOauthAPI = new GoogleOauthAPI();
    const googleDriveAPI = new GoogleDriveAPI();
    const driveImage = new DriveImage(driveData);
    const LIMIT_SIZE = 4000 * 4000;
    const LIMIT_WIDTH = 4000;
    const LIMIT_THUMB = 300;

    this.uploadImage = function (file, callback) {

        progressManager.view(function () {
            progressManager.close();
        });

        if (file.kind == "FILE") {

            progressManager.updateText("start");

            getOrCreateAlbum(file, function (album) {
                console.log(album);

                progressManager.updateText("uploading...");
                uploadImg(album, file, function (json) {
                    progressManager.updateText("upload img");
                    progressManager.update(1.0);
                    callback(json);
                });

            });

            return;
        }

        if (file.kind == "FOLDER") {

            getOrCreateAlbum(file, function (album) {

                getDirFiles(file.id, function (files) {
                    uploadImages(album, files, 0, callback);
                });

            });

            return;
        }

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

    function uploadImages(album, files, index, callback) {

        if (index == files.length) {
            progressManager.update(1.0);
            callback();
            return;
        }

        const file = files[index];

        if (file.kind == "FOLDER" || !file.contentProperties.image) {
            const count = index + 1;
            progressManager.update(count / files.length);
            console.log(count + " : " + files.length);
            uploadImages(album, files, count, callback);
            return;
        }

        uploadImg(album, file, function (json) {
            const count = index + 1;
            progressManager.update(count / files.length);
            console.log(count + " : " + files.length);
            uploadImages(album, files, count, callback);
        });

    }

    function getOrCreateAlbum(file, callback) {

        getToken(function (token) {
            progressManager.updateText("get token");

            getAlbums(token, function (albums) {
                progressManager.updateText("get album");

                getNameJson(token, function (names) {
                    progressManager.updateText("get json");

                    getAlbumName(token, file, function (albumName) {
                        progressManager.updateText("get albumName");

                        getAlbum(token, albums, albumName, function (album) {
                            progressManager.updateText("get album");
                            callback(album);
                        });

                    });

                });

            });

        });

    }

    function getAlbumName(token, file, callback) {

        const breads = getBreads();
        const json = {};

        if (file.kind == "FILE" && breads.length - 2 >= 0) {
            json.parent = breads[breads.length - 2].name;
            json.parent = getDirName(json.parent);
        } else if (file.kind == "FOLDER") {
            json.parent = breads[breads.length - 1].name;
            json.parent = getDirName(json.parent);
        }

        if (file.kind == "FILE" && breads.length - 1 >= 0) {
            json.now = breads[breads.length - 1].name;
            json.now = getDirName(json.now);
        } else if (file.kind == "FOLDER") {
            json.now = file.name;
            json.now = getDirName(json.now);
        }

        if (!isUpdateNameArray) {

            if (json.parent && json.now) {
                callback(json.parent + ":" + json.now);
                return;
            }

            callback(json.now);
            return;

        }

        const j = { names: names };

        googleDriveAPI.updateFile(token, jsonId, "application/json", j, function (result) {
            console.log(result);
            isUpdateNameArray = false;

            if (json.parent && json.now) {
                callback(json.parent + ":" + json.now);
                return;
            }

            callback(json.now);
            return;

        });

    }

    function uploadImg(album, file, callback) {

        const contentType = file.contentProperties.contentType;

        progressManager.updateText("downloading...");

        downloadImg(file.originalUrl, contentType, function (image) {

            progressManager.updateText("uploadImg...");
            upload(image, file, album, false, function (json1) {

                progressManager.updateText("uploadThumb...");
                upload(image, file, album, true, function (json2) {
                    callback(json1, json2);
                });

            });

        });

    }

    function upload(image, file, album, isThumb, callback) {

        const contentType = file.contentProperties.contentType;

        let json;

        if (!isThumb && resizeImg.isBig(image, LIMIT_SIZE)) {

            const result = resizeImg.resize(image, LIMIT_WIDTH);
            file.contentProperties.image.width = result.width;
            file.contentProperties.image.height = result.height;
            json = imgCryptor.encodeBase64(result.imageBase64);

        } else if (isThumb && resizeImg.isBigLength(image, LIMIT_THUMB)) {

            const result = resizeImg.resize(image, LIMIT_THUMB);
            file.contentProperties.image.width = result.width;
            file.contentProperties.image.height = result.height;

            if (file.name.indexOf(".") != -1) {
                const file_name = file.name.substring(0, file.name.indexOf("."));
                const extention = file.name.substring(file.name.indexOf("."), file.name.length);
                file.name = file_name + "_thumb" + extention;
            }

            json = imgCryptor.encodeBase64(result.imageBase64);

        } else {
            json = imgCryptor.encode(image, "image/webp");
        }

        progressManager.updateText("toBlob...");

        imageDataToBlob(json.imagedata, function (blob) {
            uploadGooglePhoto(album, json, file, blob, callback);
        });

    }

    function uploadGooglePhoto(album, json, file, blob, callback) {

        let name = file.name;

        if (name.indexOf(".") != -1) {
            name = name.substring(0, name.indexOf("."));
        }

        const width = file.contentProperties.image.width;
        const height = file.contentProperties.image.height;
        const title = name + ".png";
        const description = json.length + " " + width + " " + height;

        getToken(function (token) {

            progressManager.updateText("uploading...");
            googlePhotoAPI.addMedia(token, blob, title, function (uploadToken) {

                const upload = {
                    description: description,
                    token: uploadToken
                }

                progressManager.updateText("add Album...");
                googlePhotoAPI.addMediaToAlbum(token, [upload], album.id, function (json) {
                    progressManager.updateText("finish");
                    callback(json);
                });

            });

        });

    }

    function getDirName(dirName) {

        const array = (new TextEncoder).encode(dirName);
        const hash = hashids.encode(Array.from(array));

        for (let i = 0, len = names.length; i < len; i++) {

            if (names[i] == hash) {
                return hashids.encode(i);
            }

        }

        isUpdateNameArray = true;
        names.push(hash);
        return hashids.encode(names.length - 1);
    }

    function getNameJson(token, callback) {

        if (names.length > 0) {
            callback(names);
            return;
        }

        getNameJsonId(token, function (id) {

            googleDriveAPI.getFile(token, id, function (json) {
                names = json.names;
                callback(names);
            });

        });

    }

    function getNameJsonId(token, callback) {

        googleDriveAPI.getList(token, function (json) {

            const files = json.files;

            for (let i = 0, len = files.length; i < len; i++) {

                if (files[i].name == NAME_JSON) {
                    jsonId = files[i].id;
                    callback(files[i].id);
                    return;
                }

            }
        });

        callback(null);
    }


    function getToken(callback) {

        if (token.token && token.limit && token.limit > new Date().getTime()) {
            callback(token.token);
            return;
        }

        googleOauthAPI.getToken(function (json) {
            token.token = json.access_token;
            const date = new Date();
            date.setHours(date.getHours() + 1);
            token.limit = date.getTime();
            callback(json.access_token);
        });

    }

    function getAlbums(token, callback) {

        if (albums.length > 0) {
            callback(albums);
            return;
        }

        googlePhotoAPI.getAlbums(token, function (json) {

            if (json.albums) {
                albums = json.albums;
            }

            callback(albums);
        });
    }

    function getAlbum(token, albums, albumName, callback) {

        console.log(albumName);

        for (let i = 0, len = albums.length; i < len; i++) {

            if (albums[i].title == albumName) {
                callback(albums[i]);
                return;
            }
        }

        googlePhotoAPI.createAlbum(token, albumName, function (json) {
            albums.push(json);
            callback(json);
        });

    }

    function getBreads() {

        const breadCrumbs = document.querySelectorAll(".breadcrumbs.folder-path")[0];
        const lis = breadCrumbs.getElementsByTagName("li");

        let array = [];

        for (let i = 0, len = lis.length; i < len; i++) {

            const a = lis[i].getElementsByTagName("a")[0];

            if (a && !isExistClass(a.classList, "count")) {

                let id = a.dataset.id;

                if (!id) {
                    id = a.href;
                    id = id.substring(id.indexOf('folder/') + 7, id.length);
                    id = id.substring(0, id.indexOf('?'));
                }

                array.push({
                    id: id,
                    name: a.textContent
                });
            }
        }

        return array;

    }

    function downloadImg(url, contentType, callback) {

        request.request(url, { method: "GET", responseType: "arraybuffer" }, function (error, data) {

            const imageData = new Uint8Array(data);

            const urlData = URL.createObjectURL(
                new Blob([imageData], { type: contentType })
            );

            const image = new Image();

            image.onload = function () {
                callback(image);
                URL.revokeObjectURL(urlData);
            };

            image.src = urlData;

        });
    }

    function isExistClass(classList, className) {

        for (var i = 0, len = classList.length; i < len; i++) {

            if (classList[i] == className) {
                return true;
            }
        }

        return false;
    }

    function imageDataToBlob(imagedata, callback) {

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);

        canvas.toBlob(function (blob) {
            callback(blob);
        }, "image/png");

    }
}