app
    .controller('LoginCtrl', function ($http, $location, RootFactory, apiUrl) {
        const login = this;

        login.login = function () {
            $http.post(
                `${apiUrl}login/`,
                login.user,
                {headers:{"Content-Type": "application/json"}})
                .then(res => console.log("success", res.data))
                .catch(() => alert("Incorrect username/password. Please try again."));
        };
    });
