
function GetImageSrc(driveData) {

    const FILTER = "labels:src";
    const driveImage = new DriveImage(driveData)

    this.init = function (callback) {

        driveImage.searchImages(FILTER, function (json) {
            console.log(json);
            callback();
        });

    }



}