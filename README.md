# ezWeather
Get the weather of any location in the world.

## Example
An example on how to use this package.

```js
var weather = require('ezweather');

weather('Dublin', function(res) {
    console.log(res)
});
```

Output:

```js
{
  currentSummary: 'Partly Cloudy',
  hourlySummary: 'Partly Cloudy',
  dailySummary: 'Light rain today and Sunday, with temperatures rising to 51°F on Sunday.',
  weatherImage: 'https://i.imgur.com/xhwr4Kb.png',
  temp: 35.08,
  tempC: 1.7,
  fullLocation: 'Dublin, Ireland'
}
```

## Licence
Licensed under the MIT License
