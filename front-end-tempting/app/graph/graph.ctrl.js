app
    .controller('GraphCtrl', function ($http, $location, RootFactory, AuthFactory, LoggerFactory, apiUrl) {
        const graph = this;
        $http.defaults.headers.common.Authorization = 'Basic ' + RootFactory.credentials();
        graph.currentLog = LoggerFactory.currentLog();
        let timeCounter = 0;
        let fusioncharts = {};

        // ********* Graph Controls ************
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
                                    "value": "35.27",
                                    "value": "100"
                                }]
                            }]
                        },
                        "events": {
                            "initialized": function(e) {

                                function updateData() {
                                    $http.post(`${apiUrl}get_latest_temp/`, {'temp_log_id':graph.currentLog.id})
                                    .then(tempRes => {

                                        // Get reference to the chart using its ID
                                        var chartRef = FusionCharts("stockRealTimeChart");
                                            // calculate the amount of time to disply per data point
                                            timeCounter += 5;
                                            hours = Math.floor(timeCounter/3600);
                                            minutes = Math.floor((timeCounter - hours*3600)/60);
                                            seconds = Math.floor(timeCounter - (hours*3600 + minutes*60));

                                            label = `${hours}h ${minutes}m ${seconds}s`;

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
