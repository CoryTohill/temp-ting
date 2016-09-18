app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl) {
        const login = this;

        login.login = function () {
            $http.post(
                `${apiUrl}login/`,
                {"username": login.username,
                 "password": login.password},
                {headers:{"Content-Type": "application/json"}}
            )
            .then(res => {
                if (res.data.success) {
                    // save the username and password under credentials if login is successful
                    RootFactory.credentials(
                        {"username": login.username,
                         "password": login.password}
                    );
                }
                $location.path('/tickets/new');
            })
            .catch(() => alert("Incorrect username/password. Please try again."));
        };
    });
