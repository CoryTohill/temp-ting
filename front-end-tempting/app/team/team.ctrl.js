app
    .controller('TeamCtrl', function ($http, $location, RootFactory, apiUrl, AuthFactory, $cookies) {
        const team = this;
        team.currentUser = AuthFactory.currentUser();
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();

        RootFactory.getApiRoot()
            .then(root => {
                $http.get(`${root.teams}`)
                .then(res => team.allTeams = res.data);
            });

        updateTeamUserList = (teamUrl, userList) => {
            $http.patch(`${teamUrl}`, {"users" : userList});
        };

        team.addTeam = (group) => {
            // add current user to the team selected
            group.users.push(team.currentUser);

            updateTeamUserList(group.url, group.users);
        };

        team.removeTeam = (group) => {
            // remove current user from the team selected
            userIndex = group.users.indexOf(team.currentUser);
            group.users.splice(userIndex, 1);

            updateTeamUserList(group.url, group.users);
        };
    });
