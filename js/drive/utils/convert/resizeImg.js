
function ResizeImg() {

    this.isBig = function (img, size) {

        if (size <= img.width * img.height) {
            return true;
        }

        return false;

    }

    this.isBigLength = function (img, size) {

        if (img.width > size || img.height > size) {
            return true;
        }

        return false;

    }

    this.resize = function (img, size) {

        const json = calcRatio(img, size);
        var cv = document.createElement('canvas');

        cv.width = json.width;
        cv.height = json.height;

        var ct = cv.getContext('2d');

        ct.drawImage(img, 0, 0, img.width, img.height, 0, 0, json.width, json.height);
        var base64 = cv.toDataURL("image/webp");
        ct.clearRect(0, 0, json.width, json.height);
        ct = null;
        cv = null;

        return {
            imageBase64: base64,
            width: json.width,
            height: json.height
        };

    }

    function calcRatio(img, size) {

        let w, h;

        if (img.width > img.height) {
            w = size;
            h = img.height * size / img.width;
            return { width: w, height: h };
        }

        h = size;
        w = img.width * size / img.height;

        return { width: w, height: h };

    }

}