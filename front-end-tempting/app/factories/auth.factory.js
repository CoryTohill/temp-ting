app

    .factory('AuthFactory', ($location, apiUrl, $http, RootFactory, $cookies) => {
        let loggedIn = false;
        let cookieCreds = $cookies.getObject('temptingCredentials');
        let currentUser = null;

        // prevents page reloading from logging users out by setting currentUser,
        // user credentials, and loggedIn variable if local cookie credentials exist
        if (cookieCreds) {
            currentUser = cookieCreds.username;
            RootFactory.credentials(cookieCreds);
            loggedIn = true;
        }

        return {
            currentUser (username) {
                if (username) {
                    currentUser = username;
                } else {
                    return currentUser;
                }
            },

            login (username, password) {
                return $http.post(`${apiUrl}login/`,
                                  {"username": username,
                                  "password": password},
                                  {headers:{"Content-Type": "application/json"}}
                        );
            },

            isUserLoggedIn (boolean) {
                if (typeof boolean !== "undefined") {
                    loggedIn = boolean;
                } else {
                    return loggedIn;
                }
            },

            register (username, password) {
                return RootFactory.getApiRoot()
                    .then(root => $http.post(`${root.users}`,
                        {"username": username,
                         "password": password,
                         "teams":[]},
                        {headers:{"Content-Type": "application/json"}}
                    ));
            }
        };
    });
