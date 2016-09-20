app
    .controller('TempLogCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const tempLog = this;
        tempLog.currentUser = AuthFactory.currentUser();
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.templogs}`)
                .then(res => console.log(res));
            });

    });
