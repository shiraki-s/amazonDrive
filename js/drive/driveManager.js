
function DriveManager() {

    const driveData = new DriveData();
    const amazonAPI = new AmazonAPI();
    const getImageSrc = new GetImageSrc(driveData);
    const driveImage = new DriveImage(driveData)
    const initPhotoSwipe = new InitPhotoSwipe(driveData);
    const viewBread = new ViewBread(driveData);
    const footerManager = new FooterManager(driveData);
    const viewImage = new ViewImage(driveData);
    const downloadImage = new DownloadImage(driveData, new ProgressManager());
    const contextMenuManager = new ContextMenuManager(driveData);

    this.init = function () {

        initBread(function () {

            getImageSrc.init(function () {

                initView();
                footerManager.init();

                const id = driveData.getNowDir();

                driveImage.getImages(id, function (json) {
                    driveData.addCash(id, json);
                    viewImage.view();
                    initPhotoSwipe.init('.imageContainer');

                    contextMenuManager.init(function (id) {
                        refresh();
                    }, function () {
                        refresh();
                    }, function () {
                        refresh();
                    }, function () {
                        refresh();
                    });
                });

            });


        });

    }

    function initBread(callback) {

        amazonAPI.getAuthToken(function (token) {
            driveData.setAuthToken(token);
            driveData.setAuthTokenLimit();

            viewBread.init(function (id, name) {
                driveData.setNowDir(id);
                driveData.setNowDirName(name);
                callback();

            }, function (id) {

                if (id == driveData.getNowDir()) {
                    return;
                }

                viewImages(id, function () {
                    viewBread.view();
                });

            }, function (json) {
                viewImage.view(json.data);
                scrollTo(0, 0);
            });

        });

    }

    function initView() {

        viewImage.init(function (file) {

            driveData.setNowDirName(file.name);

            viewImages(file.id, function () {
                viewBread.view();
            });

        }, function (file) {

            downloadImage.download(file, function () {

            });

        });
    }

    function refresh() {

        const top = window.pageYOffset;
        const nowDir = driveData.getNowDir();

        viewImages(nowDir, function () {
            viewBread.view();
            scrollTo(0, top);
        });

    }

    function viewImages(id, callback) {

        const cash = driveData.getCash(id);

        if (cash) {
            replaceUrl(id);
            driveData.setNowDir(id);
            viewImage.view();
            callback();
            return;
        }

        driveImage.getImages(id, function (json) {
            replaceUrl(id);
            driveData.addCash(id, json);
            driveData.setNowDir(id);
            viewImage.view();
            callback();
        });


    }

    function replaceUrl(path) {
        const url = "clouddrive/folder/" + path + "?_encoding=UTF8&mgh=1&ref_=s9_acss_bw_h1_JDSH_bn_w&sf=1";
        history.replaceState('', '', url);
    }

}