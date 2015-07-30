# Video.js Levels

HLS Level selection button for [pivotshare/video-js-swf](https://github.com/pivotshare/video-js-swf) fork.

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="video.js"></script>
<script src="videojs-levels.js"></script>
<script>
  videojs(document.querySelector('video')).levels();
</script>
```

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.
Some HLS manifests do not like being run from file system, so use Python to run a webserver: `python -m SimpleHTTPServer`.
