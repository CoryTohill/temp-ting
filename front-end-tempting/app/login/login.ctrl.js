app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl) {
        const login = this;

        login.login = function () {
            $http.post(
                `${apiUrl}login/`,
                {"username": login.username,
                 "password": login.password},
                {headers:{"Content-Type": "application/json"}})
                .then(res => console.log("success", res.data))
                .catch(() => alert("Incorrect username/password. Please try again."));
        };
    });
