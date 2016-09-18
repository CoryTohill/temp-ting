app

    .controller('NavBarCtrl', function ($location, RootFactory, AuthFactory, $scope, $cookies) {
        const navBar = this;

        navBar.loggedIn = AuthFactory.isUserLoggedIn();

        // watches for changes in AuthFactory.isUserLoggedIn and fires function if changed
        $scope.$watch(() => AuthFactory.isUserLoggedIn(),
            (newVal, oldVal) => {
                navBar.loggedIn = newVal;
            }
        );

        navBar.isActive = (viewLocation) => {
            return viewLocation === $location.path();
        };

        navBar.logout = () => {
            AuthFactory.isUserLoggedIn(false);
            RootFactory.credentials({});
            $cookies.remove('temptingCredentials');
            $location.path("/");
        };

    });
