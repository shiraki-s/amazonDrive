
function GoogleOauthAPI() {

    const request = new HttpRequest();
    const URL = "https://us-central1-eloquent-hour-258707.cloudfunctions.net/googlePhoto/token";
    // const URL = "http://localhost:3000/token";

    this.getToken = function (callback) {

        const params = {
            method: "GET",
        };

        request.request(URL, params, function (error, json) {

            if (error) {
                console.log(error);
                callback({});
                return;
            }

            callback(json);
        });

    }
}