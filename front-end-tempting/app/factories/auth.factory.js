app

    .factory('AuthFactory', ($timeout, $location, apiUrl, $http) => {
        let currentUser = null;

        return {
            login (username, password) {
                return $http.post(`${apiUrl}login/`,
                                  {"username": username,
                                  "password": password},
                                  {headers:{"Content-Type": "application/json"}}
                        );
            },

    //   logout () {
    //    return $timeout().then(() => (
    //       firebase.auth().signOut().then(function() {
    //         // Sign-out successful.
    //         currentUser = null;
    //       }, function(error) {
    //         // An error happened.
    //         alert('Error Logging Out');
    //       })
    //     ));
    //   },

    //   register (email, password) {
    //     return $timeout().then(() => (
    //       firebase.auth().createUserWithEmailAndPassword(email, password)
    //     ));
    //   },

    //   getUser () {
    //     return currentUser;
    //   }
    };
  });
