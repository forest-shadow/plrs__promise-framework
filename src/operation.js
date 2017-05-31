const delayms = 1;

// all functions below simulate async; simulate api

function getCurrentCity(callback) {
  setTimeout(function () {

    const city = "New York, NY";
    // we pass null for the error; node-like style convention callbacks
    callback(null, city);

  }, delayms)
}

function getWeather(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get weather"));
      return;
    }

    const weather = {
      temp: 50
    };

    callback(null, weather)

  }, delayms)
}

function getForecast(city, callback) {
  setTimeout(function () {

    if (!city) {
      callback(new Error("City required to get forecast"));
      return;
    }

    const fiveDay = {
      fiveDay: [60, 70, 80, 45, 50]
    };

    callback(null, fiveDay)

  }, delayms)
}

suite.only("operations");

function fetchCurrentCity() {
  const operation = new Operation();

  getCurrentCity(operation.nodeCallback);

  return operation;
}

function fetchWeather(city) {
  const operation = new Operation();

  getWeather(city, operation.nodeCallback);

  return operation;
}

function fetchForecast(city) {
  const operation = new Operation();

  getForecast(city, operation.nodeCallback);

  return operation;
}

function Operation() {
  const operation = {
    successReactions: [],
    errorReactions: []
  };
  operation.fail = function fail(error) {
    operation.state = "failed";
    operation.error = error;
    operation.errorReactions.forEach(r => r(error));
  };
  operation.succeed = function succeed(result) {
    operation.state = "succeeded";
    operation.result = result;
    operation.successReactions.forEach(r => r(result));
  };
  operation.onCompletion = function setCallbacks( onSuccess, onError ) {
    const noop = function () {
    };

    if ( operation.state === "succeeded" ) {
      onSuccess( operation.result );
    } else if (operation.state === "failed") {
      onError(operation.error);
    } else {
      operation.successReactions.push(onSuccess || noop);
      operation.errorReactions.push(onError || noop);
    }
  };
  operation.onFailure = function onFailure(onError) {
    operation.onCompletion(null, onError);
  };

  operation.nodeCallback = function (error, result) {
    if(error) {
      operation.fail(error);
      return;
    }
    operation.succeed(result);
  };

  return operation;
}

function doLater(func) {
  setTimeout(func, 1);
}

test("register error callback async", function(done) {
  var operationThatErrors = fetchWeather();

  doLater(function() {
    operationThatErrors.onCompletion((city) => done());
  });
});

test("register success callback async", function(done) {
  var operationThatSucceeds = fetchCurrentCity();

  doLater(function() {
    operationThatSucceeds.onCompletion((city) => done());
  });
});

test("noop if no success handler passed", function(done) {

  const operation = fetchCurrentCity();

  // noop should register for success handler
  operation.onFailure( error  => done(error) );

  // trigger success to make sure noop registered
  operation.onCompletion( result  => done() );
});

test("noop if no error handler passed", function(done) {

  // todo operation that can fail
  const operation = fetchCurrentCity();

  // noop should register for error handler
  operation.onCompletion( result  => done() );

  // trigger failure to make sure noop registered
  operation.onFailure( error  => done() );
});

test("pass multiple callbacks - all of them are called", function(done) {

  const operation = fetchCurrentCity();

  const multiDone = callDone(done).afterTwoCalls();

  operation.onCompletion( result  => multiDone() );
  operation.onCompletion( result  => multiDone() );
});

test("fetchCurrentCity pass the callbacks later on", function(done) {
  // initiate operation
  const operation = fetchCurrentCity();

  // register callbacks
  operation.onCompletion(
    result  => done(),
    error   => done(error)
  );
});