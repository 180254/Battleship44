# **Battleship44**

Just <a href="https://en.wikipedia.org/wiki/Battleship_(game)">battleship</a> html5 `game`.

<img src="screenshots/0.png" alt="screenshot" width="700"/>

## features

Supported (implemented) `fleet sizes`:

* russian (4, 3, 3, 2, 2, 2, 1, 1, 1, 1)
* classic one (5, 4, 3, 3, 2)
* classic two (5, 4, 3, 2, 2, 1, 1)

Supported (implemented) `fleet modes`:

* straight fleets
* curved fleets

Supported `langs` (translated strings):  

* english  
* polish  

Supported (?tested?) `browsers`:  

* ES7 (default in debug mode): Chrome 53, Firefox 51
* ES5 (default in production mode): any modern browser <sub>ie11 is not modern</sub>

## **architecture**

* back-end (`BE`) and front-end (`FE`) may be runned separately (two servers: `run.s`)  
* or FE may be copied into BE and run together (one server: `run.t`)

## **front-end**

### info-general
* FE is written in `html5+TypeScript2`
* FE uses `npm` as build automation tool & dependency manager

### info-configuration
* set the FE mode by changing DEBUG flag (static/js/app.loader.js)  
* (`run.s`) set the BE address by changing API_WS_URL var (static/js/app.loader.js)
* (`run.s`) set the FE default listening port by changing var (server.js)

### compile-dependencies
* [nodejs, npm](https://nodejs.org/en/) >=?

### compile-steps
* install all FE compile-dependencies
* go to app main directory
* execute `npm run install-update`
* execute `npm run collect-compile`
* execute `npm run convert-minify`

### run-dependencies
* (`run.s`) [nodejs, npm](https://nodejs.org/en/) >=?
* (`run.t`) none

### run-steps
* (`run.s`) go to app main directory
* (`run.s`) execute `npm start`

## **back-end**

### info-general
* it is `spring boot` application
* BE is written in `Java 8`
* BE uses `maven` as build automation tool & dependency manager

### info-configuration
* set your favorite fleet sizes/mode in .properties (src/main/resources/application.properties)
* set the BE default listening port in .properties (src/main/resources/application.properties)

### compile-dependencies
* [java development kit](http://www.oracle.com/technetwork/java/javase/overview/index.html) >=1.8
* [maven](https://maven.apache.org/) >= 3.3 (wrapper is provided)

### compile-steps
* (`run.t`) compile FE first
* generally steps are [as in any spring boot app](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build-tool-plugins-maven-packaging)
* install all BE compile-dependencies
* go to app main directory
* (`run.s`) run `mvn clean package`
* (`run.t`) run `mvn clean package -Pfe`

### run-dependencies
* [java se runtime environment >=1.8](http://www.oracle.com/technetwork/java/javase/overview/index.html)

### run-steps
* go to app main directory
* execute `java -jar target/battleship44-0.0.1.jar`

## changelog 
v1.0  
+ first version  
  
v1.1  
+ front: general improvements and refactoring  
+ front: handle WinSocket onerror event  
+ front: info about number of players in current game  
+ front: info about current winning ratio  
+ back/front: info about number of players on server (STAT)  
+ back: add on error controller  
+ back: possible to customize WebSocket conf&policy by .properties file  
  
v1.2  
+ front: general improvements and refactoring  
+ front: i18n: strings configurable by json files  
+ front: i18n: polish lang support  
+ front: i18n: possible to change lang without page reload  
+ front: pointer cursor on all flag, and cross-hair on shoot grid  
  
v1.3  
+ front: re-written & refactored js to TypeScript2  
+ front: source now written with targeting es7, es5 also available (transcompiled)  
+ front: js file is now minified  
+ back: controller fix (commit/b23803f28d790c34e47c8b8d2cf753f07860c15d)
 
v1.4
+ general: separated front-end/back-end codes, now may be runned separately  
  
vX.Y  
- back/front: dynamic info from server about fleet sizes (was hardcoded in html file)  
- back/front: info which ship sizes are already shot & which are still to shoot down  
- back/front: mini chat in game, between players  
- back/front: fleet-type is now game-level, not server-level  
- back/front: grid-size is now game-level, not server-level  
- back/front: able to set custom (game-level) fleet-type (sizes) & grid-size  

## protocol

→ `TO__ SERVER`  
← `FROM SERVER`  
  
← `HI_. <some_text>`  
  
→ `GAME NEW`  
→ `GAME <game_id>`  
← `GAME OK <game_id>`  
← `GAME FAIL no-such-game`  
← `GAME FAIL no-free-slot`  
← `400_ you-are-in-game`  
  
→ `GRID 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
← `GRID OK`  
← `GRID FAIL`  
← `400_ no-game-set`  
← `400_ game-in-progress`  
← `400_ grid-already-set`  
  
← `2PLA`  
← `TOUR START`  
← `TOUR YOU`  
← `TOUR HE`  
  
→ `SHOT [0,2]`  
← `YOU_ [SHIP,0,2],[EMPTY,2,1],[EMPTY,2,2]`  
← `HE__ [EMPTY,2,7]`  
← `400_ no-game-set`  
← `400_ game-waiting`  
← `400_ not-your-tour`  
← `400_ bad-shoot`  
  
← `WON_ YOU`  
← `WON_ HE`  
  
← `1PLA game-interrupted`  
← `1PLA game-not-interrupted`  
  
← `STAT players=10,reserved=1`  
  
→ `PING <ping_msg>`  
← `PONG <ping_msg>`  
  
→ `<bad_command>`  
← `400_ unknown-command`  

## documentation
  
* protocol  
* code  
* comments
