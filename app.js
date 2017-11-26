const request = require('superagent')

var chip = {};

module.exports = function(gAPI, dsAPI, location, callback) {
  chip.weather(gAPI, dsAPI, location, callback);
};

chip.weather = async function(gKEY, dsKEY, location, callback) {
  var lat;
  var long;
  var fullAddress;
  // First get the lattitude and longitude for the given city/state/zip code/country using google's geocode API
  request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${gKEY}`)
      .end(function(err, res) {
        try {
        var parsedJson = JSON.parse(res.text);
        var info = parsedJson.results[0];
        var apiError = parsedJson.error_message;
        if (apiError === 'The provided API key is invalid.') return callback('Invalid Geocode API key.')
        if (!info) return callback('Invalid location given.')
        //console.log(info); if needed to add more geo info, enable
        lat = info.geometry.location.lat;
        long = info.geometry.location.lng;
        fullAddress = info.formatted_address;
      }
      catch(err) {
        return err;
    }
   // Use the lattitude and longitude to get the weather using darksky's weather api, which uses longitude and latitude
      request.get(`https://api.darksky.net/forecast/${dsKEY}/${lat},${long}`)
      .end(function(err, res) {
        // Error checking
        if(dsKEY.length !== 32 || /[A-Z]/.test(dsKEY)) return callback('Invalid Darksky API key.');
        var requestLimitChecker = res.text.toString().toLowerCase();
        if(requestLimitChecker.includes('forbidden')) return callback('Maximum API requests reached, please wait another day.');
        if(err) return callback(err);

        var parsedJson = JSON.parse(res.text)
        //console.log(parsedJson); if needed to add more features on weather, enable
        // Summaries:
        var summary = parsedJson.currently.summary; // The weather summary for now
        var hSummary = parsedJson.currently.summary; // Hour's summary
        var dSummary = parsedJson.daily.summary; // Today's summary
        // Image variable
        var img;
        // Temperatures
        var temp = parsedJson.currently.temperature; // Temperature in Fahernheit
        var tempC = (5/9) * (temp-32); // Temperature in Celsius
        tempC = tempC.toFixed(1);
        tempC = parseFloat(tempC);
        // Addresses
        var address = fullAddress; // The full city/state/country for the given location
        // Weather images
        const summaryy = summary.toLowerCase();
        switch(true) {
          case summaryy === 'cloudy':
            img = 'https://i.imgur.com/zKwo2DO.png';
          break;
          case summaryy === 'partly cloudy':
            img = 'https://i.imgur.com/xhwr4Kb.png';
          break;
          case summaryy.includes('rain'):
            img = 'https://i.imgur.com/BXiYtme.png';
          break;
          case summaryy === 'drizzle':
            img = 'https://i.imgur.com/JUMJOlJ.png';
          break;
          case summaryy.includes('sun'):
            img = 'https://i.imgur.com/ZhTAgd0.png';
          break;
          case summaryy === 'clear':
            img = 'https://i.imgur.com/ZhTAgd0.png';
          break;
          case summaryy === 'overcast':
            img = 'https://i.imgur.com/xhwr4Kb.png';
          break;
          case summaryy.includes('snow'):
            img = 'https://i.imgur.com/RjcWSHq.png';
          break;
          default:
            img = 'https://i.imgur.com/zKwo2DO.png';
          break;
        }
        // Object structure
        var weather = {'currentSummary': summary, 'hourlySummary': hSummary, 'dailySummary': dSummary, 'weatherImage': img, 'temp': temp, 'tempC': tempC, 'fullLocation': address};
        // Example output
        return callback(weather);
        //console.log(`Summary: ${summary}\nHourly summary: ${hSummary}\nDaily summary: ${dSummary}\nTemperature: ${temp}F° (${tempC.toFixed(2)}C°)\nAddress: ${address}`);
        });
    }); // end of api request.

};
