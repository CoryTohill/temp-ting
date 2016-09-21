app.config(($routeProvider) => (
    $routeProvider
      .when("/", {
        controller: "HomepageCtrl",
        controllerAs: "home",
        templateUrl: "app/homepage/homepage.html"
      })
      .when("/graph", {
        controller: "GraphCtrl",
        controllerAs: "graph",
        templateUrl: "app/graph/graph.html"
      })
      .when("/group", {
        controller: "TeamCtrl",
        controllerAs: "team",
        templateUrl: "app/team/team.html"
      })
      .when("/login", {
        controller: "LoginCtrl",
        controllerAs: "login",
        templateUrl: "app/login/login.html"
      })
      .when("/tempLog", {
        controller: "TempLogCtrl",
        controllerAs: "tempLog",
        templateUrl: "app/tempLog/tempLog.html"
      })
      .when("/createLog", {
        controller: "CreateLogCtrl",
        controllerAs: "createLog",
        templateUrl: "app/createLog/createLog.html"
      })
      .otherwise("/")
  ));
