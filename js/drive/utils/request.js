function HttpRequest(timeout) {

    this.request = function (url, params, callback) {

        var request = new XMLHttpRequest();

        if (timeout) {
            request.timeout = timeout;
        }

        request.onreadystatechange = function () {

            if (request.readyState == 4) {

                if (request.status == 200) {

                    if (request.responseType == "text") {
                        callback(null, request.responseText);
                        return;
                    }

                    if (request.responseType == "document") {
                        callback(null, request.responseXML.body.innerHTML);
                        return;
                    }

                    try {

                        const json = JSON.parse(request.responseText);

                        if (json.httpStatus && json.httpStatus == 200) {
                            callback(null, json);
                            return;
                        }

                        callback(json, null);

                    } catch (e) {
                        console.log(url);
                        console.log(params);
                        console.log(request.responseText);
                        callback(e, null);
                        return;
                    }

                }

                return;
            }

        }

        request.onerror = function (e) {
            callback(e, null);
            return;
        }

        request.ontimeout = function (e) {
            callback(e, null);
            return;
        }

        // console.log(url);
        // console.log(params);
        if (params.method == "GET" && params.querys && params.contentType != "application/json") {
            url += "?" + parseQuerys(params.querys)
        }

        request.open(params.method, url, true);

        if (params.contentType) {
            // console.log(params.contentType);
            request.setRequestHeader("Content-Type", params.contentType);
        } else {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }

        if (params.headers) {
            setHeaders(request, params.headers);
        }

        if (params.contentType == "application/json") {
            // console.log(params.querys);
            request.send(params.querys);
            return;
        }

        if (params.contentType == "application/octet-stream") {
            request.send(params.binary);
            return;
        }

        if (params.responseType) {
            request.responseType = params.responseType;
        }

        if (params.method == "GET") {
            request.send();
            return;
        }

        request.send(parseQuerys(params.querys));
    }

    function setHeaders(request, headers) {

        for (let i = 0, len = headers.length; i < len; i++) {
            request.setRequestHeader(headers[i].name, headers[i].value);
        }

    }

    function parseQuerys(querys) {

        if (!querys) {
            return "";
        }

        let query = "";

        for (let i = 0, len = querys.length; i < len; i++) {

            if (i == 0) {
                query = querys[i].key + "=" + querys[i].value;
                continue;
            }

            query = query + "&" + querys[i].key + "=" + querys[i].value;
        }

        return query;
    }

}
