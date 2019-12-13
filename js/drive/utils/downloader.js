
function Downloader() {

    const request = new HttpRequest();

    this.downloadByParallel = function (items, parallelMax, downloadCallback, endCallback) {

        const results = divideItems(items, parallelMax);
        const jobs = doParallels(results, downloadCallback);

        Promise.all(jobs).then(function (results) {
            const result = createResult(results);
            endCallback(result);
        });

    }

    function createResult(results) {

        results.sort(function (a, b) {
            if (a.index > b.index) return 1;
            if (a.index < b.index) return -1;
            return 0;
        });

        const array = [];

        for (let i = 0, len = results.length; i < len; i++) {
            const result = results[i].datas;

            for (let j = 0, len = result.length; j < len; j++) {
                array.push(result[j]);
            }
        }

        return array;

    }

    function doParallels(results, callback) {

        const jobs = [];

        for (let i = 0, len = results.length; i < len; i++) {

            const result = results[i];

            const promise = new Promise((resolve, reject) => {
                downloads(result, i, [], 0, callback, resolve);
            });

            jobs.push(promise);
        }

        return jobs;

    }

    function downloads(items, number, results, index, downloadCallback, resultCallback) {

        if (items.length <= index) {
            resultCallback({ datas: results, index: number });
            return;
        }

        const item = items[index]

        download(item, function (result) {
            downloadCallback();
            results.push(result);
            const count = index + 1;
            downloads(items, number, results, count, downloadCallback, resultCallback);
        });

    }

    function download(item, callback) {

        const params = {
            method: "GET",
            responseType: item.type
        };

        request.request(item.url, params, function (error, data) {

            const result = {
                name: item.name,
            };

            if (error) {
                result.data = null;
                callback(result);
                return;
            }

            result.data = data;

            callback(result);

        });

    }

    function divideItems(items, parallelMax) {

        let n = items.length / parallelMax;

        if (items.length % parallelMax != 0) {
            n = Math.floor(items.length / parallelMax) + 1;
        }

        return divide(items, n);

    }

    function divide(ary, n) {

        var idx = 0;
        var results = [];
        var length = ary.length;

        while (idx + n < length) {
            var result = ary.slice(idx, idx + n)
            results.push(result);
            idx = idx + n
        }

        var rest = ary.slice(idx, length + 1)
        results.push(rest)
        return results;
    }

}