
function FooterManager(driveData) {


    const DOWNLOAD_PATH = "https://user-images.githubusercontent.com/23305275/70778349-6cd6ca00-1dc5-11ea-890d-0eec6ab1118e.png";
    const DOWNLOAD_RE_PATH = "https://user-images.githubusercontent.com/23305275/70778385-84ae4e00-1dc5-11ea-8539-e2795e2a54b3.png";

    this.init = function () {

        // if (isTablet()) {
            // initDom();
            // const footer = document.getElementsByTagName("footer")[0];
            // initDownloadButtion(footer);
        // }
    }

    function initDom() {

        const footer = document.createElement("footer");

        const button1 = document.createElement("button");
        button1.classList.add("footer_button");
        button1.classList.add("button_dl");

        const img1 = document.createElement("img");
        img1.src = DOWNLOAD_PATH;
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
                img.src = DOWNLOAD_PATH;
                driveData.setDownloadMode(false);
                return;
            }

            img.src = DOWNLOAD_RE_PATH;
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