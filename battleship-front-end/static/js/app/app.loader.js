let DEBUG = false;
// eslint-disable-next-line no-unused-vars
const API_WS_URL = window.location.host;

// app loader
// - easily change app version (?v=5c)
// - easily change load mode (?m=ss)
// - easily change debug flag (?d=1)
// - load additional libs for specified ver
$(() => {
  const modes = {
    ss: 'script-src',
    st: 'script-text',
  };
  const scripts = {
    dist: ['app.dist.js'],
  };

  const defaults = {
    debug: {
      mode: 'script-src',
      script: 'dist',
    },
    prod: {
      mode: 'script-text',
      script: 'dist',
    },
  };

  // ---------------------------------------------------------------------------------------------------------------

  const loadScript = function (mode, src) {
    if (mode === 'script-src') {
      // create tag <script src="xx"></script>
      // - browser loads source map
      // - useful for debugging
      const scripts = document.getElementById('script');
      const ref = document.createElement('script');

      ref.setAttribute('src', src);
      scripts.appendChild(ref);

      // jQuery alert!
      // $("<script>", {src: src}).appendTo("#script"); code is misleading
      // it loads file using xhr, and then execute jQuery.DOMEval method
      // discussed at stackoverflow: http://stackoverflow.com/q/15459218

      return new $.Deferred().resolve();
    } else if (mode === 'script-text') {
      // create tag <script>code</script>
      // - browser does _not_ load source map
      // - sourceMappingURL comment need not be removed
      // - useful for production

      return $.ajax({dataType: 'script', cache: true, url: src});
    }
  };

  // ---------------------------------------------------------------------------------------------------------------

  const urlParam = function (name) {
    const nameEsc = name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    const results = new RegExp('[?&]' + nameEsc + '=([^&#]*)').exec(
      window.location.href
    );
    return results ? decodeURIComponent(results[1]) : null;
  };

  // ---------------------------------------------------------------------------------------------------------------

  // returns:
  // * value if validArray.contains(value)
  // * default value if not
  const requireValid = function (value, validArray, defaultVal) {
    return value && validArray.indexOf(value) !== -1 ? value : defaultVal;
  };

  // ---------------------------------------------------------------------------------------------------------------

  const debug = requireValid(urlParam('d'), ['1', '0'], DEBUG);

  DEBUG = !!+debug; // convert to boolean; may be "0", "1", 0, 1, false, true

  // ---------------------------------------------------------------------------------------------------------------

  const mode = requireValid(
    urlParam('m'),
    Object.keys(modes),
    DEBUG ? defaults.debug.mode : defaults.prod.mode
  );

  const script = requireValid(
    urlParam('v'),
    Object.keys(scripts),
    DEBUG ? defaults.debug.script : defaults.prod.script
  );

  const mode_ = modes[mode];
  const script_ = scripts[script];

  // ---------------------------------------------------------------------------------------------------------------

  const deferred = new $.Deferred();
  let pipe = deferred;

  $.each(script_, (i, val) => {
    pipe = pipe.pipe(() => {
      return loadScript(mode_, val).then(
        () => {
          if (DEBUG) {
            console.log('debug | app.loader | ok=' + val);
          }
        },
        () => {
          console.log('ERROR | app.loader | fail=' + val);
        }
      );
    });
  });

  deferred.resolve();
});
