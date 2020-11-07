# **Battleship44**

Just <a href="https://en.wikipedia.org/wiki/Battleship_(game)">battleship</a> html5 `game`. Perhaps available <a href="https://battleship.8tr.pl/">online</a>.  

<img src="screenshots/0.png" alt="screenshot" width="700"/>

## features

Supported `fleet sizes`:

* russian (4, 3, 3, 2, 2, 2, 1, 1, 1, 1)
* classic one (5, 4, 3, 3, 2)
* classic two (5, 4, 3, 2, 2, 1, 1)

Supported `fleet modes`:

* straight fleets
* curved fleets

Supported `langs`:  

* english  
* polish  

Supported `browsers`:  

* development mode: last Chrome version, last Firefox version
* production mode: any <sub>modern</sub> browser

## **architecture**

* back-end (`BE`) and front-end (`FE`) may running both standalone
* or `FE` can be copied into `BE` and run together

## **back-end**

* `BE` is written in `Java 11`
* it is `spring boot` application
* uses `maven` as build automation tool & dependency manager
* requires system-wide dependencies: [Java](http://www.oracle.com/technetwork/java/javase/overview/index.html) >= 11, [maven](https://maven.apache.org/) >= 3.2.5
* install local (project) dependencies: (auto installed while compiling)
* compile (`FE` not included): `mvn package`
* compile with included `FE`: `mvn package -Pfe`
* start: `java -jar target/battleship44-0.0.1.jar <game server properties>`
* available `game server properties`:
  - `--server.port=<port>`
  - `--game.rules.fleet-sizes=<size>` (`russian`, `classic_one`, `classic_two`)
  - `--game.rules.fleet-mode=<mode>` (`straight`, `curved`)
  - `--game.rules.fleet-can-touch-each-other-diagonally=<value>` (`true`, `false`)
  - `--game.rules.show-fields-for-sure-empty=<value>` (`true`, `false`)

## **front-end**

* `FE` is written in `html5+TypeScript4`
* uses `npm`, `webpack` as build automation tool & dependency manager
* requires system-wide dependencies: [nodejs](https://nodejs.org/en/) >=12.0.0
* install local (project) dependencies: `npm install`
* compile in `development` mode: `npx webpack --mode development`
* compile in `production` mode: `npx webpack --mode production`
* default backend in `development` mode: `ws://localhost:8080/ws`
* default backend in `production` mode: `protocol + '//' + window.location.host + '/ws`
* compile with a custom backend url: `BACKEND='ws://localhost:8080/ws' npx webpack --mode <mode>`
* start in the standalone mode: `node server.js <server port>`

## changelog 
v1.0.0 (released 2016-08-18)  
+ first version  
  
v1.1.0 (released 2016-08-22)  
+ front: general improvements and refactoring  
+ front: handle WinSocket onerror event  
+ front: info about the number of players in the current game  
+ front: info about the current winning ratio  
+ back/front: info about the number of players on a the server (STAT)  
+ back: add on error controller  
+ back: possibility to customize WebSocket conf&policy using the .properties file  
  
v1.2.0 (released 2016-08-31)  
+ front: general improvements and refactoring  
+ front: i18n: strings configurable with json files  
+ front: i18n: polish lang support  
+ front: i18n: possibility to change lang without reloading the page  
+ front: pointer cursor on flags, and cross-hair on the shooting grid  
  
v1.3.0 (released 2016-10-05)   
+ front: re-written & refactored js to TypeScript2  
+ front: source now written with targeting es7, es5 also available (transcompiled)  
+ front: minified js file  
+ back: controller fix (commit/b23803f28d790c34e47c8b8d2cf753f07860c15d)  
  
v1.4.0 (released 2017-05-10)  
+ general: separated front-end/back-end codes, now they can be started separately  
+ front bug fix: WebSocket connection on HTTPS didn't work  
+ front bug fix: flag URLs were incorrect (uppercase)  
  
v1.4.1 (released 2020-09-24)
+ front: dependencies maintenance  
+ front: development/build process refactored & simplified  
+ front: refactored code to meet [gts](https://github.com/google/gts) rules  
+ back: dependencies maintenance  
+ back: code updated to java 11  
  
v2.0.0 (unreleased)  
+ general: revised protocol  
+ back: added endpoint with metrics  
+ back/front: new feature: random fleet location  
+ back/front: new feature: possibility to change game rules in each game  
+ back/front: compiled game code takes less space, less dependencies  
+ front: new feature: several themes to choose from  
  
vX.Y.Z (unplanned)  
- "availability broadcasting" - look for a waiting player  
- back/front: info which ship sizes has been already been shot down & which are still to shoot down  
- back/front: a mini chat in game, between players  
- back/front: grid-size is now customizable at game-level, not at server-level  
  
## protocol
  
→ `TO__ SERVER`  
← `FROM SERVER`  
  
← `HI_. <some_text>`  
  
→ `GAME NEW`  
→ `GAME <game_id>`  
← `GAME OK <game_id>`  
← `400 GAME no-such-game`  
← `400 GAME no-free-slot`  
← `400 GAME you-are-in-game`  
  
← `GAME-RULES grid-size=10x10,fleet-sizes=russian,fleet-mode=curved,...`  
→ `GAME-RULES fleet-sizes=next`  
→ `GAME-RULES fleet-sizes=classic_one`  
← `GAME-RULES fleet-sizes=classic_one`  
← `400 GAME-RULES no-game-set`  
← `400 GAME-RULES game-in-progress`  
← `400 GAME-RULES 2pla-in-game`  
← `400 GAME-RULES invalid-game-rules-change`  
  
→ `GRID 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
← `GRID OK`  
← `GRID FAIL`  
← `400 GRID no-game-set`  
← `400 GRID game-in-progress`  
← `400 GRID grid-already-set`  
  
→ `GRID RANDOM`  
← `GRID RANDOM 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
  
← `2PLA`  
← `TOUR START`  
← `TOUR YOU`  
← `TOUR HE`  
  
→ `SHOT [0,2]`  
← `YOU_ [SHIP,0,2],[EMPTY,2,1],[EMPTY,2,2]`  
← `HE__ [EMPTY,2,7]`  
← `400 SHOT no-game-set`  
← `400 SHOT game-waiting`  
← `400 SHOT not-your-tour`  
← `400 SHOT bad-shoot`  
  
← `WON_ YOU`  
← `WON_ HE`  
  
← `1PLA game-interrupted`  
← `1PLA game-not-interrupted`  
  
← `STAT players=10,reserved=1`  
  
→ `PING <ping_msg>`  
← `PONG <ping_msg>`  
  
→ `<bad_command>`  
← `400 unknown-command`  

## documentation
  
* protocol  
* code  
* comments  
