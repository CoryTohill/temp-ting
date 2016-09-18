app

    .controller('NavBarCtrl', function ($location, RootFactory, AuthFactory, $scope) {
        const navBar = this;

        navBar.loggedIn = AuthFactory.isUserLoggedIn();

        // watches for changes in AuthFactory.isUserLoggedIn and fires function if changed
        $scope.$watch(() => AuthFactory.isUserLoggedIn(),
            (newVal, oldVal) => {
                navBar.loggedIn = newVal;
            }
        );

        navBar.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

    });
