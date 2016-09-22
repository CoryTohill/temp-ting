app
    .controller('GraphCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory, apiUrl, $timeout) {
        const graph = this;
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();
        graph.currentLog = LoggerFactory.currentLog();
        let timeCounter = 0;
        let fusioncharts = {};
        let startValues = 0;
        let startLabels = [];

        getLatestTemp = () => {
            return $http.post(`${apiUrl}get_latest_temp/`, {'temp_log_id':graph.currentLog.id});
        };

        calculateTimeRemaining = () => {
            if (graph.targetTemp !== undefined) {
                // get the estimated total cook time in seconds
                $http.post(`${apiUrl}calculate_cook_time`,
                            {'temp_log_id': graph.currentLog.id,
                             'target_temp': graph.targetTemp})
                    .then(res => {
                        cookTime = res.data;
                        // subtracts the start date from the current time and convert to seconds
                        timeElapsed = (Date.now() - new Date(graph.currentLog.start_date).getTime()) / 1000;
                        timeRemianing = cookTime - timeElapsed;

                        graph.timeRemaining = convertToHoursMinutesSeconds(timeRemianing);
                });
            }
        };

        convertToHoursMinutesSeconds = (totalSeconds) => {
            hours = Math.floor(totalSeconds/3600);
            minutes = Math.floor((totalSeconds - hours*3600)/60);
            seconds = Math.floor(totalSeconds - (hours*3600 + minutes*60));

            return `${hours}h ${minutes}m ${seconds}s`;
        };

        graph.endLog = () => {
            $http.post(`${apiUrl}stop_logging_temps/`,
                       {"temp_log_id": graph.currentLog.id})
                .then(() => $location.path('/tempLog'));
        };

        // ********* Graph Setup ************
        // make sure currentLog is set before making $http call
        $timeout().then(() => graph.currentLog = LoggerFactory.currentLog())

            // call to get all temps
            .then(log =>
                $http.post(`${apiUrl}get_all_temps_by_templog/`,
                                     {"temp_log_id": log.id}))

            // previous values to display on graph load
            .then(res => startValues = res.data.temps)

            .then(values => {
                // create appropriate time labes for each value
                values.forEach((val) => {
                    timeCounter += 5;
                    startLabels.push({"label": convertToHoursMinutesSeconds(timeCounter)});
                });
                // prevent starting values/labels from exceeding the set graph length of 50
                // by keeping only the most recent 50 values/labels
                if (startValues.length > 50) {
                    startValues.splice(0, startValues.length - 50);
                    startLabels.splice(0, startLabels.length - 50);
                }
            })

            // ********* Graph Controls ************
            .then(() => {
                if (LoggerFactory.chartInitialized() === false) {
                    FusionCharts.ready(function(){
                            LoggerFactory.chartInitialized(true);
                            fusioncharts = new FusionCharts({
                                id: "stockRealTimeChart",
                                type: 'realtimeline',
                                renderAt: 'chart-container',
                                width: '1000',
                                height: '300',
                                dataFormat: 'json',
                                dataSource: {
                                    "chart": {
                                        "caption": graph.currentLog.description,
                                        "xAxisName": "Time",
                                        "yAxisName": "Temperature \u00B0F",
                                        "refreshinterval": "1",
                                        "yaxisminvalue": "0",
                                        "yaxismaxvalue": "200",
                                        "numdisplaysets": "50",
                                        "labeldisplay": "rotate",
                                        "showValues": "0",
                                        "showRealTimeValue": "0",
                                        "theme": "fint"
                                    },
                                    "categories": [{
                                        "category": startLabels
                                    }],
                                    "dataset": [{
                                        "data": startValues
                                    }]
                                },
                                "events": {
                                    "initialized": function(e) {

                                        function updateData() {
                                            // calculate the remianing time
                                            if (graph.targetTemp !== null) {
                                                calculateTimeRemaining();
                                            }

                                            getLatestTemp()
                                            .then(tempRes => {
                                                // Get reference to the chart using its ID
                                                var chartRef = FusionCharts("stockRealTimeChart");
                                                    // calculate the amount of time to display per data point
                                                    timeCounter += 5;
                                                    label = convertToHoursMinutesSeconds(timeCounter);

                                                    // Build Data String in format &label=...&value=...
                                                    strData = "&label=" + label + "&value=" + tempRes.data;
                                                // Feed it to chart.
                                                chartRef.feedData(strData);
                                            });
                                        }
                                        // amount of time to wait before refiring updateData function
                                        e.sender.chartInterval = setInterval(function() {
                                            updateData();
                                        }, 5000);
                                    },
                                    "disposed": function(evt, arg) {
                                        clearInterval(evt.sender.chartInterval);
                                    }
                                }
                            });
                            fusioncharts.render();
                        });
                    }
            });
    });
