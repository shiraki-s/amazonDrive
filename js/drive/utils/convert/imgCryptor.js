
function ImgCryptor() {

    const convertImg = new ConvertImg();

    this.encode = function (img, contentType) {

        const str = ImageToBase64(img, contentType);
        const array = string_to_buffer(str);
        const length = array.byteLength;

        return {
            imagedata: convertImg.convertBinaryToImg(array),
            length: length
        };
    }

    this.encodeBase64 = function (base64) {

        const array = string_to_buffer(base64);
        const length = array.byteLength;

        return {
            imagedata: convertImg.convertBinaryToImg(array),
            length: length
        };

    }

    this.decode = function (img, length) {
        return decodeImg(img, length);
    }

    function decodeImg(img, length) {
        const data = convertImg.convertImgToBinary(img, length);
        const str = large_buffer_to_string(data.buffer);
        return str;
    }

    function buffer_to_string(buf) {
        return String.fromCharCode.apply("", new Uint8Array(buf))
    }

    function string_to_buffer(src) {
        return (new Uint8Array([].map.call(src, function (c) {
            return c.charCodeAt(0)
        }))).buffer;
    }

    function large_buffer_to_string(buf) {
        var tmp = [];
        var len = 1024;
        for (var p = 0; p < buf.byteLength; p += len) {
            tmp.push(buffer_to_string(buf.slice(p, p + len)));
        }
        return tmp.join("");
    }

    function ImageToBase64(img, mime_type) {
        // New Canvas
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw Image
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // To Base64
        return canvas.toDataURL(mime_type);
    }

}