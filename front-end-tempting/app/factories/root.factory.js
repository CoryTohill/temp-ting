app
    .constant('apiUrl', "http://localhost:8000/")

    .factory('RootFactory', ($http, $timeout, apiUrl) => {
        let apiRoot = null;
        let httpGet = $http.get(apiUrl);
        let userCredentials = {};

        return {
            getApiRoot () {
                return httpGet.then(res => res.data);
            },
            credentials (creds) {
                if (creds) {
                    userCredentials = creds;
                } else {
                    if (userCredentials.hasOwnProperty("password")) {
                        return window.btoa(`${userCredentials.username}:${userCredentials.password}`);
                    } else {
                        return false;
                    }
                }
            }
        };
    });
