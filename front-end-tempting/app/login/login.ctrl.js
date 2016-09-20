app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const login = this;

        login.login = () => {
            AuthFactory.login(login.username, login.password)
                .then(res => {
                    // save the username and password under credentials if login is successful
                    RootFactory.credentials({"username": login.username,
                                             "password": login.password});
                    // set the new Authorization credentials
                    $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

                    // sets loggedIn variable to true for navBar purposes
                    AuthFactory.isUserLoggedIn(true);

                    RootFactory.getApiRoot()
                        .then(root => {
                            // get the logged in user's backend info
                            $http.get(`${root.users}`)
                                .then(userRes => {
                                    userInfo = {"username": login.username,
                                             "password": login.password,
                                             "url": userRes.data[0].url};

                                    // set current user to the backend url
                                    AuthFactory.currentUser(userRes.data[0].url);

                                    // stores the credentials as a cookie
                                    $cookies.putObject('temptingCredentials', userInfo);

                                });
                        });
                })
                .then(() => $location.path('/'))
                .catch(() => alert("Incorrect username/password. Please try again."));
        };

        login.register = () => {
            AuthFactory.register(login.username, login.password)
                .then(() => login.login(login.username, login.password));
        };
    });
