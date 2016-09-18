app

    .factory('AuthFactory', ($location, apiUrl, $http) => {
        let loggedIn = false;

        return {
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
            }

        //   register (email, password) {
        //     return $timeout().then(() => (
        //       firebase.auth().createUserWithEmailAndPassword(email, password)
        //     ));
        //   },

        //   getUser () {
        //     return currentUser;
        //   }
        };
  });
