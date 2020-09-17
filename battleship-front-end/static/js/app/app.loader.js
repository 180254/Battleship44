/* This app is not running in env environment. How to disable? */
/* eslint-disable node/no-unsupported-features/es-syntax */

window.API_WS_URL = 'localhost:8080';
window.DEBUG = true;
import * as $ from 'jquery';
// app loader
// - easily change app version (?v=dist)
// - easily change load mode (?m=script-src)
// - easily change debug flag (?d=1)
// - load additional libs for specified ver
$(() => {
  const modes = {
    'script-src': 'script-src',
    'script-text': 'script-text',
  };
  const scripts = {
    dist: ['js/dist/app.dist.js'],
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
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
  };

  // ---------------------------------------------------------------------------------------------------------------

  // returns:
  // * value if validArray.contains(value)
  // * default value if not
  const requireValid = function (value, validArray, defaultVal) {
    return value && validArray.indexOf(value) !== -1 ? value : defaultVal;
  };

  // ---------------------------------------------------------------------------------------------------------------

  const debug = requireValid(urlParam('d'), ['1', '0'], window.DEBUG);

  window.DEBUG = !!+debug; // convert to boolean; may be "0", "1", 0, 1, false, true

  // ---------------------------------------------------------------------------------------------------------------

  const mode = requireValid(
    urlParam('m'),
    Object.keys(modes),
    window.DEBUG ? defaults.debug.mode : defaults.prod.mode
  );

  const script = requireValid(
    urlParam('v'),
    Object.keys(scripts),
    window.DEBUG ? defaults.debug.script : defaults.prod.script
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
          if (window.DEBUG) {
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

export {};
