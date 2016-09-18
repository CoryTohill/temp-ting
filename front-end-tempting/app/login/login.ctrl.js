app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory) {
        const login = this;

        login.login = function () {
            AuthFactory.login(login.username, login.password)
                .then(res => {
                    if (res.data.success) {
                        // save the username and password under credentials if login is successful
                        RootFactory.credentials(
                            {"username": login.username,
                             "password": login.password}
                        );
                        // sets loggedIn variable to true for navBar purposes
                        AuthFactory.isUserLoggedIn(true);
                        // redirects to homepage
                        $location.path('/');
                    }
                })
                .catch(() => alert("Incorrect username/password. Please try again."));
        };
    });
