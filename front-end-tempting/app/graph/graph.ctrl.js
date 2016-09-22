app
    .controller('GraphCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory, apiUrl) {
        const graph = this;
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();
        graph.currentLog = LoggerFactory.currentLog();
        let timeCounter = 0;
        let fusioncharts = {};
        let startValue = 0;

        getLatestTemp = () => {
            return $http.post(`${apiUrl}get_latest_temp/`, {'temp_log_id':graph.currentLog.id});
        };

        calculateTimeRemaining = () => {
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
        };

        convertToHoursMinutesSeconds = (totalSeconds) => {
            hours = Math.floor(totalSeconds/3600);
            minutes = Math.floor((totalSeconds - hours*3600)/60);
            seconds = Math.floor(totalSeconds - (hours*3600 + minutes*60));

            return `${hours}h ${minutes}m ${seconds}s`;
        };

        graph.endLog = () => {

            $location.path('/tempLog')
        };

        // ********* Graph Controls ************
        getLatestTemp().then(res => startValue = res.data)
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
                                        "category": [{
                                            "label": "0"
                                        }]
                                    }],
                                    "dataset": [{
                                        "data": [{
                                            "value": startValue,
                                        }]
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
