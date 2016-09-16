app

    .controller('NavBarCtrl', function (UserRecipe, $location, AuthFactory) {
        const navBar = this;

        determines whether a user is logged in or out and shows appropriate nav bar options
        function isUserLoggedIn () {
            if (firebase.auth().currentUser) {
            navBar.loggedIn =  true;
            } else {
            navBar.loggedIn = false;
            }
        }

        navBar.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        // event listener that fires whenever a user logs in or out
        firebase.auth().onAuthStateChanged(isUserLoggedIn);

        navBar.newRecipe = function () {
            // sets the viewed recipe to a new recipe
            UserRecipe.setRecipe({"ingredients": []});
            // forces page to reload if link is clicked while on page
            $location.path('../#/recipeEditor');
        };

        navBar.logout = function () {
            AuthFactory.logout()
            .then(() => $location.path('/'));
        };
    });
