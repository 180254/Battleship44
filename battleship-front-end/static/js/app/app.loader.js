/* eslint-disable node/no-unsupported-features/es-syntax */

import * as $ from 'jquery';

window.BACKEND = 'CONFIG_BACKEND';
window.MODE = 'CONFIG_MODE';

// app loader
// - easily change mode (?mode=dev, ?mode=prod)
// - easily change app version (?app=dist)
// - easily change load script mode (?load=script-src, ?load=script-text)
// - load additional libs for specified ver
$(() => {
  const modes = {
    dev: {
      loadScriptMode: 'script-src',
      appsKey: 'dist',
    },
    prod: {
      loadScriptMode: 'script-text',
      appsKey: 'dist',
    },
  };

  const apps = {
    dist: ['js/dist/app.dist.js'],
  };
  // ---------------------------------------------------------------------------------------------------------------

  const loadScript = function (loadScriptMode, src) {
    if (loadScriptMode === 'script-src') {
      const scripts = document.getElementById('script');
      const ref = document.createElement('script');

      ref.setAttribute('src', src);
      scripts.appendChild(ref);

      // jQuery alert!
      // $("<script>", {src: src}).appendTo("#script"); code is misleading
      // it loads file using xhr, and then execute jQuery.DOMEval method
      // discussed at stackoverflow: http://stackoverflow.com/q/15459218

      // noinspection JSValidateTypes
      return new $.Deferred().resolve();
    } else if (loadScriptMode === 'script-text') {
      return $.ajax({dataType: 'script', cache: true, url: src});
    }
  };

  // ---------------------------------------------------------------------------------------------------------------

  const getUrlParam = function (name) {
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

  const paramMode = requireValid(getUrlParam('mode'), ['dev', 'prod'], 'prod');

  const paramApp = requireValid(
    getUrlParam('app'),
    Object.keys(apps),
    modes[paramMode].appsKey
  );

  const paramLoad = requireValid(
    getUrlParam('load'),
    ['script-src', 'script-text'],
    modes[paramMode].loadScriptMode
  );

  // ---------------------------------------------------------------------------------------------------------------

  // noinspection JSValidateTypes
  const deferred = new $.Deferred();
  let pipe = deferred;

  $.each(apps[paramApp], (i, val) => {
    pipe = pipe.pipe(() => {
      return loadScript(paramLoad, val).then(
        () => {
          if (window.MODE) {
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
