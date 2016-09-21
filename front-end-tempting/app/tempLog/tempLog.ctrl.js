app
    .controller('TempLogCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory) {
        const tempLog = this;
        let logsOrganizedByTeam = {};
        tempLog.currentUser = AuthFactory.currentUser();
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.templogs}`)
                    .then(res => {
                        // organize the log data by team and calculate total cook time if available
                        res.data.forEach((log) => {
                            // calculate total cook hours and minutes
                            if (log.end_date) {
                                let startTimestamp = new Date(log.start_date).getTime();
                                let endTimestamp = new Date(log.end_date).getTime();
                                let totalTime = (endTimestamp - startTimestamp);

                                log.total_hours = Math.floor(totalTime / 3600000);
                                log.total_minutes = Math.floor((totalTime - (log.total_hours * 3600000)) / 60000);
                            }
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

        tempLog.selectLog = (log) => {
            LoggerFactory.currentLog(log);
            $location.path('/graph');
        };
    });
