app
    .factory('LoggerFactory', ($location, apiUrl, $http, RootFactory, $cookies) => {
        let currentLog = null;

        return {
            currentLog (log) {
                if (log) {
                    currentLog = log;
                } else {
                    return currentLog;
                }
            }
        };
    });
