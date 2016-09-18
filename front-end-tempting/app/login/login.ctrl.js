app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const login = this;

        login.login = function () {
            AuthFactory.login(login.username, login.password)
                .then(res => {
                    if (res.data.success) {

                        creds = {"username": login.username,
                                 "password": login.password};

                        // save the username and password under credentials if login is successful
                        RootFactory.credentials(creds);
                        // sets loggedIn variable to true for navBar purposes
                        AuthFactory.isUserLoggedIn(true);

                        console.log("creds", creds)
                        // stores the credentials as a cookie
                        $cookies.put('temptingCredentials', creds);

                        // redirects to homepage
                        $location.path('/');
                    }
                })
                .catch(() => alert("Incorrect username/password. Please try again."));
        };
    });
