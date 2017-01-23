# iframe-communicator
Communicate between two or more iframes to run scripts synchronously.

## Goals
- Fast
- Easy to use

## Usage

### ES6
```javascript
import IFrameCommunicator from 'iframe-communicator';

const com = new IFrameCommunicator('my_id', ['fizz', 'buzz']);
com.on('ready', () => {
  // do something...
});
com.register();
```

### ES5

```html
<script src="path/to/iframe-communicator/dist/ic.min.js"></script>
<script>
  (function() {
    var Communicator = window.IFrameCommunicator['default'];
    var com = new Communicator('my_id', ['fizz', 'buzz']);

    com.on('ready', function() {
      // do something...
    });
    com.register();
  })();
</script>
```
