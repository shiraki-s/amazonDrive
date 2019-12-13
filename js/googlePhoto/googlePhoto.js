import { GooglePhotoAPI } from "./googlePhotoAPI.js";

export function GooglePhoto() {

    const code = "ya29.ImCwBwIbIG99qqpjxJJJgMxx7TVlq7c2BVcbcvHq2yb9KERoY4lBwMdHxgEeWX4PurkWIdwhnn_kCMbb5dj2jynX3mIn3SajZivSOSDFtSvolSt4J-drjHlXV2iVdPRtmv4";
    const googlePhotoAPI = new GooglePhotoAPI(code);

    this.start = function () {

        const id = "AJVZgpKncC3ZW8r2rWR8JcuQun4LFLR2FhCIgVeqi-hq-3Z2Fbroh3qcJuV-j84lrzWfdMt21VIA";
        const img = document.getElementsByTagName("img")[0];
        const str = ImageToBase64(img, "image/png");
        const data = string_to_buffer(str);
        // const binary = new Blob([data], { type: "image/png" });
        const binary = data;

        const time = new Date().getTime();

        googlePhotoAPI.addMedia(binary, "001_43375_" + time + "_.png", function (uploadToken) {

            googlePhotoAPI.addMediaToAlbum([uploadToken], id, function (json) {
                console.log(json);
            });

        });

        // googlePhotoAPI.getAlbums(function (json) {
        // console.log(json);
        // const id = json.albums[0].id;

        // googlePhotoAPI.searchMedias(id, function (json) {
        // console.log(json);
        // const url = json.mediaItems[0].baseUrl + "=d";
        // const url = json.mediaItems[0].productUrl;

        // googlePhotoAPI.getMedia(url, function (json) {
        // console.log(json);
        // });
        // })
        // });

    }

    function string_to_buffer(src) {
        return (new Uint8Array([].map.call(src, function (c) {
            return c.charCodeAt(0)
        }))).buffer;
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