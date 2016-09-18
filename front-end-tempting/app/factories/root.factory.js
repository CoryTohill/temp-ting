app
    .constant('apiUrl', "http://127.0.0.1:8000/")

    .factory('RootFactory', ($http, apiUrl, $cookies, AuthFactory) => {
        let apiRoot = null;
        let httpGet = $http.get(apiUrl);
        let userCredentials = {};
        let cookieCreds = $cookies.get('temptingCredentials');

        // prevents page reloading from logging users out by setting
        // user credentials and loggedIn variable if local cookie credentials exist
        if (cookieCreds) {
            userCredentials = cookieCreds;
            AuthFactory.isUserLoggedIn(true);
        }

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
