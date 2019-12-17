
function GetImageSrc(driveData) {

    const FILTER = "labels:src";
    const driveImage = new DriveImage(driveData)

    this.init = function (callback) {

        driveImage.searchImages(FILTER, function (json) {
            const array = [];

            for (let i = 0, len = json.data; i < len; i++) {

                const name = json.data[i].name;
                const src = json.data[i].originalUrl;

                array.push({ name: name, src: src });
            }

            console.log(array);
            driveData.setImageSrcs(array);

            callback();
        });

    }



}