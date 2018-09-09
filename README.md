# Gallery

## Installation
To use the gallery put ```<script src="gallery.js"></script>``` and  ```<link rel="stylesheet" type="text/css" href="gallery.css">``` inside the ```<head>``` tag of your HTML file. The files are located in the ```src``` directory.

Additionally you have to use a proxy srver for bypassing CORS by adding an appropriate header to the API response. To navigate to the directory ```src/proxy``` , then run ```node/proxy.js``` (requires Node.js installation).

### Demo
A demo of the functionality is included in the project. To view the demo run ```demo/demo.html```.

## Usage
You can use the gallery by creating a Gallery object.

Every Gallery class instance needs to be provided with a div container object, which functions as a placeholder for the gallery:
```html
<svg id="container"></svg>
```

Parameters:

<a name="options">_options_</a> object may contain the following attributes:
  * container: a div, which functions as a placeholder for the gallery,
  * api: url to api for images,
  * looping: boolean; true - gallery looping enabled, false - gallery looping disabled

### Example
```
An example of a gallery:

```javascript
var gallery = new Gallery({
    'container': document.getElementById('container'),
    'looping': true,
    'api': 'https://example.com'
});
```


