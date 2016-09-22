app
    .factory('LoggerFactory', ($location, apiUrl, $http, RootFactory, $cookies) => {
        let currentLog = null;
        let chartInitialized = false;

        return {
            currentLog (log) {
                if (log) {
                    currentLog = log;
                } else {
                    return currentLog;
                }
            },
            chartInitialized (boolean) {
                if (boolean) {
                    chartInitialized = boolean;
                } else {
                    return chartInitialized;
                }
            }
        };
    });
