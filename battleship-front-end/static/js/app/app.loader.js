// app loader
// - easily change mode (?mode=dev, ?mode=prod)
// - easily change app version (?app=dist)
// - easily change load script mode (?load=script-src, ?load=script-text)
// - load additional libs for specified ver

(function () {
  window.BACKEND = 'CONFIG_BACKEND';
  window.MODE = 'CONFIG_MODE';

  const modes = {
    dev: {
      loadScriptMode: 'script-src',
      appsKey: 'dist',
    },
    prod: {
      loadScriptMode: 'script-src',
      appsKey: 'dist',
    },
  };

  const apps = {
    dist: ['js/dist/app.dist.js'],
  };

  const loadScript = function (loadScriptMode, src) {
    return new Promise((resolve, reject) => {
      if (loadScriptMode === 'script-src') {
        const scripts = document.getElementById('script');
        const ref = document.createElement('script');
        ref.setAttribute('src', src);
        scripts.appendChild(ref);
        return resolve();
      }
      if (loadScriptMode === 'script-text') {
        return fetch(src)
          .then(response => response.text())
          .then(response => {
            const scripts = document.getElementById('script');
            const ref = document.createElement('script');
            ref.innerText = response;
            scripts.appendChild(ref);
          });
      }
      return reject();
    });
  };

  const getUrlParam = function (name) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
  };

  // returns:
  // * value if validArray.contains(value)
  // * default value if not
  const requireValid = function (value, validArray, defaultVal) {
    return value && validArray.indexOf(value) !== -1 ? value : defaultVal;
  };

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

  let pipe = Promise.resolve();
  console.log(apps[paramApp]);
  apps[paramApp].forEach(val => {
    pipe = pipe.then(() => {
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
})();
