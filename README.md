# iframe-communicator
Communicate between two iframes to run scripts synchronously.

## Goals
- < 1kb
- Fast
- Easy to use

## API
### `setId`
```javascript
ic.setId('iframe-a');
```

### `waitFor`
```javascript
ic.waitFor('iframe-a', function() {
  console.log('iframe-a found');
});
```

## Best practice
### Timeout after X ms
**`frame-a.html` (master)**
```html
<script src="path/to/ic.js"></script>
<script>
  (function() {
    var waitInterval;

    function run(windowB) {
      // ...
    }

    ic.setId('a');
    waitInterval = ic.waitFor('b', run);

    setTimeout(function() {
      clearInterval(waitInterval);
      run(null);
    }, 5000);
  })();
</script>
```

**`frame-b.html` (slave)**
```html
<script src="path/to/ic.js"></script>
<script>
  (function() {
    ic.setId('b');
  })();
</script>
```
