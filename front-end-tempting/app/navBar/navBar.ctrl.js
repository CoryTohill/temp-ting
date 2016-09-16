app

    .controller('NavBarCtrl', function ($location, RootFactory) {
        const navBar = this;

        navBar.loggedIn = RootFactory.credentials();

        navBar.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

    });
