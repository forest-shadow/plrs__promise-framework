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

suite.only("opearations");

function fetchCurrentCity(onSuccess, onError) {
  getCurrentCity(function(error, result) {
    if(error) {
      onError(error);
    }
    onSuccess(result);
  })
}

test("fetchCurrentCity with separate success and error callbacks", function(done) {
  fetchCurrentCity(
    result  => done(),
    error   => done(error)
  );
});