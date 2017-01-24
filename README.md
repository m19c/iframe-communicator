# iframe-communicator
Communicate between two or more iframes to run scripts synchronously.

```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x                                           x                                                    x
x      +-----------------------------+      x     A depends on B, C                              x
x      |                             |      x     B depends on A, C                              x
x      v                             v      x     C depends on A, B                              x
x    +---+          +---+          +---+    x                                                    x
x    | A |<-------->| B |<-------->| C |    x     B is "ready"                                   x
x    +-+-+          +-+-+          +-+-+    x     B sends a "ping"-event to all frames (0)       x
x      |              |              |      x                                                    x
x      |              |              |      x     A is "ready"                                   x
x      |            READY            |      x     A sends a "ping"-event to all frames (1)       x
x      |              |              |      x     B now knows that A is "ready"                  x
x      |              |              |      x     B answers with a "pong"-event                  x
x      |              |              |      x     A now knows that B is "ready"                  x
x      |              |              |      x                                                    x
x    READY ---ping--->|              |      x     C is "ready"                                   x
x      |<-----pong----|              |      x     C sends a "ping"-event to all frames (2)       x
x      |------ping------------------>|      x     A now knows that C is "ready"                  x
x      |              |              |      x     A answers with a "pong"-event                  x
x      |              |              |      x     C now knows that A is "ready"                  x
x      |              |              |      x     B now knows that C is "ready"                  x
x      |              |              |      x     B answers with a "pong"-event                  x
x      |              |<---ping--- READY    x     C now knows that B is "ready"                  x
x      |              |----pong----->|      x                                                    x
x      |<------------------ping------|      x     B knows A, C and calls the "ready"-handler     x
x      |-------------------pong----->|      x     A knows B, C and calls the "ready"-handler     x
x      |              |              |      x     C knows A, B and calls the "ready"-handler     x
x      +              +              +      x                                                    x
x                                           x                                                    x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

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
com.ready();
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
    com.ready();
  })();
</script>
```
