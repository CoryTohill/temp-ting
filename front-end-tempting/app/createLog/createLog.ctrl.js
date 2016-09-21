app
    .controller('CreateLogCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory, apiUrl) {
        const createLog = this;
        createLog.currentUser = AuthFactory.currentUser();
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.teams}`)
                .then(res => createLog.allTeams = res.data);
            });

        createLog.create = () => {
            if (createLog.team !== null) {
                $http.post(`${apiUrl}start_logging_temps/`,
                           {"thermometer": createLog.thermometer,
                            "description": createLog.description,
                            "team_id": createLog.team.id})
                    .then(res =>
                        RootFactory.getApiRoot()
                            .then(root => {
                                $http.get(`${root.templogs}${res.data}/`)
                                    .then(res => {
                                        LoggerFactory.currentLog(res.data);
                                        $location.path('/graph');
                                    })
                            })

                        )
            }
        };
    });
