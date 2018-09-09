# Gallery

## Installation
To use the gallery put ```<script src="gallery.js"></script>``` and  ```<link rel="stylesheet" type="text/css" href="gallery.css">``` inside the ```<head>``` tag of your HTML file. The files are located in the ```src``` directory.

Additionally, you have to use a proxy server for bypassing CORS by adding an appropriate header to the API response. To use, navigate to the directory ```src/proxy```, then run ```node proxy.js``` (requires Node.js installation).

### Demo
A demo of the functionality is included in the project. To view the demo run ```demo/demo.html```.

## Usage
You can use the gallery by creating a Gallery object.

Every Gallery class instance needs to be provided with a ```div``` container object, which functions as a placeholder for the gallery:
```html
<div id="container"></div>
```

Parameters:

Gallery class accepts single parameter <a name="options">options</a> object with the following attributes:
  * container: HTML element ```div``` which functions as a placeholder for the gallery
  * api: string (URL to the API providing images)
  * looping: boolean (true: gallery looping enabled, false: gallery looping disabled)

### Example

```javascript
new Gallery({
    'container': document.getElementById('container'),
    'looping': true,
    'api': 'http://example.com'
});
```

