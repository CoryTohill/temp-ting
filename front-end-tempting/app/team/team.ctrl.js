app
    .controller('TeamCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const team = this;
        team.currentUser = AuthFactory.currentUser()

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.teams}`)
                .then(res => team.allTeams = res.data)
            })
    });
