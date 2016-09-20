app
    .controller('TempLogCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const tempLog = this;
        let logsOrganizedByTeam = {};
        tempLog.currentUser = AuthFactory.currentUser();
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.templogs}`)
                    .then(res => {
                        // organize the log data by team
                        res.data.forEach((log) => {
                            if (logsOrganizedByTeam[log.team]) {
                                logsOrganizedByTeam[log.team].push(log);
                            } else {
                                logsOrganizedByTeam[log.team] = [log];
                            }
                        });

                        // replace the url for the team with the name in database for display purposes
                        for (let team in logsOrganizedByTeam) {
                            $http.get(team)
                                .then(res => {
                                    logsOrganizedByTeam[res.data.name] = logsOrganizedByTeam[team];
                                    delete logsOrganizedByTeam[team];
                                });
                        }
                        tempLog.logs = logsOrganizedByTeam;
                    });
            });
    });
