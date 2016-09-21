app
    .controller('CreateLogCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory) {
        const createLog = this;
        createLog.currentUser = AuthFactory.currentUser()

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.teams}`)
                .then(res => createLog.allTeams = res.data);
            });


    });
