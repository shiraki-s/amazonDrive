
function FooterManager(driveData) {


    const DOWNLOAD = "download.png";
    const DOWNLOAD_RE = "download_re.png";

    this.init = function () {

        // if (isTablet()) {
            initDom();
            const footer = document.getElementsByClassName("footer-buttons")[0];
            initDownloadButtion(footer);
        // }
    }

    function initDom() {

        const footer = document.createElement("div");
        footer.classList.add("footer-buttons")

        const button1 = document.createElement("button");
        button1.classList.add("footer_button");
        button1.classList.add("button_dl");

        const img1 = document.createElement("img");
        img1.src = driveData.getImageSrc(DOWNLOAD);
        button1.appendChild(img1);

        footer.appendChild(button1);
        document.body.appendChild(footer);

    }

    function initDownloadButtion(footer) {

        const button = footer.getElementsByClassName("button_dl")[0];

        button.addEventListener("click", function () {

            const button = footer.getElementsByClassName("button_dl")[0];
            const img = button.getElementsByTagName("img")[0];

            if (driveData.isDownloadMode()) {
                img.src = driveData.getImageSrc(DOWNLOAD);
                driveData.setDownloadMode(false);
                return;
            }

            img.src = driveData.getImageSrc(DOWNLOAD_RE);
            driveData.setDownloadMode(true);
        });

    }

    function isTablet() {

        var ua = navigator.userAgent;

        if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
            return true;
        } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
            return true;
        } else {
            return false;
        }
    }

}