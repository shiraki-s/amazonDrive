
function ConvertImg() {

    this.convertImgToBinary = function (img, length) {

        const imageData = createImgData(img);
        console.log(imageData);
        const data = imageDataToBinary(imageData, length);
        return data;
    }

    this.convertImgToBinaryByWalker = function (img, fileType, callback) {

        const imageData = createImgData(img);

        console.time("worker");
        var worker = new Worker("js/utils/worker.js");

        var data = {
            imageData: imageData,
            number: -1
        }

        worker.addEventListener('message', (message) => {
            const array = message.data;

            if (fileType) {
                callback(new Blob([array], { type: fileType }));
                console.timeEnd("worker");
                return;
            }

            callback(array);
            console.timeEnd("worker");
            return;
        });

        worker.postMessage(data, [data.imageData.data.buffer]);

    }

    this.convertImgToBinaryByPararell = function (img, fileType, workerMax, callback) {

        const imageData = createImgData(img);

        const jobs = [];
        const imageDatas = splitImageData(imageData, workerMax);

        let i, len;

        console.time("worker");
        for (i = 0, len = workerMax; i < len; i++) {

            const worker = new Worker("js/worker.js");

            const promise = new Promise((resolve, reject) => {
                worker.addEventListener('message', (message) => {
                    resolve(message.data);
                });
            });

            jobs.push(promise);

            const data = {
                imageData: imageDatas[i],
                number: i
            }
            worker.postMessage(data, [data.imageData.buffer]);
        }

        Promise.all(jobs).then(function (results) {
            console.timeEnd("worker");

            let length = 0;

            for (let i = 0, len = results.length; i < len; i++) {
                length = length + results[i].data.length;
            }

            let array = new Uint8Array(length);

            let i, j, k, len, len2;
            k = 0;

            for (i = 0, len = results.length; i < len; i++) {

                const data = results[i].data;

                for (j = 0, len2 = data.length; j < len2; j++) {
                    array[k] = data[j];
                    k++;
                }
            }
            callback(new Blob([array], { type: fileType }));
        });

    }

    this.convertBinaryToImg = function (arrayBuffer) {

        const arry = new Uint8Array(arrayBuffer);

        const length = arry.length;

        let area;
        if (length % 3 == 0) {
            area = length / 3;
        } else {
            area = Math.floor(length / 3) + 1;
        }

        const side = calcSide(area);
        const xy = calcXY(side, area);

        let count = 0;
        var image_data = new ImageData(xy.x, xy.y);
        let y, x, len1, len2;

        for (y = 0, len1 = xy.y; y < len1; y++) {

            for (x = 0, len2 = xy.x; x < len2; x++) {

                const index = (x + y * xy.x) * 4;

                if (length > count) {
                    image_data.data[index] = arry[count];
                    image_data.data[index + 1] = arry[++count];
                    image_data.data[index + 2] = arry[++count];
                    image_data.data[index + 3] = 255;
                    count++;
                    continue;
                }

                image_data.data[index] = 0;
                image_data.data[index + 1] = 255;
                image_data.data[index + 2] = 0;
                image_data.data[index + 3] = 255;

            }
        }

        return image_data;

    }

    function imageDataToBinary(imageData, length) {

        let array = new Uint8Array(length);

        let y, len1, x, len2, z = 0, alpha = 0;
        let count = 0;
        const width = imageData.width;
        const data = imageData.data;

        for (let i = 0, len = data.length; i < len; i++) {

            if (i == (alpha * 4 + 3)) {
                alpha++;
                continue;
            }

            if(count == length){
                break;
            }

            array[count] = data[i];
            count++;
        }
        // for (y = 0, len1 = imageData.height; y < len1; y++) {

        //     for (x = 0, len2 = imageData.width; x < len2; x++) {

        //         const index = (x + y * width);

        //         if (index == length) {
        //             break;
        //         }

        //         if (index == (alpha * 4 + 3)) {
        //             alpha++;
        //             continue;
        //         }

        //         if (data[index] == 0) {
        //             if (data[index + 1] == 255) {
        //                 continue;
        //             }
        //         }

        //         array[z] = data[index];
        //         z++;
        //     }
        // }

        return array;
    }


    function calcSide(area) {
        let side = Math.sqrt(area * Math.tan(Math.PI / 4));
        return Math.ceil(side);
    }

    function calcXY(side, area) {

        const x = side;
        let y = side;
        const len = Math.abs(area - side * side) / side;

        if (Math.floor(len) >= 1) {
            y = y - Math.floor(len);
        }

        const xy = {
            x: x,
            y: y
        }

        return xy;
    }

    function createImgData(img) {

        var cv = document.createElement('canvas');
        cv.width = img.naturalWidth;
        cv.height = img.naturalHeight;

        var ct = cv.getContext('2d');
        ct.drawImage(img, 0, 0);

        var data = ct.getImageData(0, 0, cv.width, cv.height);
        return data;
    }

    function splitImageData(imageData, num) {

        const length = imageData.data.length;
        const split1 = length / 4;
        const split2 = ((split1 - split1 % num) / num) * 4;
        const rest = (split1 % num) * 4;
        const array = imageData.data;

        const imageDatas = [];
        let i, len;

        for (i = 0, len = num; i < len; i++) {

            let ar;

            if (i == len - 1 && rest != 0) {
                ar = array.slice(split2 * i, split2 * (i + 1) + rest);
            } else {
                ar = array.slice(split2 * i, split2 * (i + 1));
            }

            imageDatas.push(ar);
        }

        return imageDatas;
    }
}