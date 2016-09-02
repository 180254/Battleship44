#**Battleship44**  

##compile & run

* It is spring boot application. It uses maven as build automation tool.  
* Front-end is written in TypeScript, and compiled .js file is `not` provided.

### compile-dependencies
Back-end compile dependencies:

* [java development kit >=1.8](http://www.oracle.com/technetwork/java/javase/overview/index.html)
* [maven](https://maven.apache.org/) - wrapper is provided
* dependencies are listed in `pom.xml` config file  

Front-end (TypeScript files) compile dependencies:

* [nodejs](https://nodejs.org/en/)
* [bower](https://www.npmjs.com/package/bower)
* [bower-installer](https://www.npmjs.com/package/bower-installer)
* [typings](https://www.npmjs.com/package/typings)
* [typescript](https://www.npmjs.com/package/typescript)

### compile-steps
* first front-end, then back-end

Front-end:  

* install all front-end compile-dependencies
* go to app src/main/resources directory
* execute `bower install`
* execute `bower-installer -r`
* execute `typings install`
* execute `tsc`

Back-end:

* generally, [as any spring boot app](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build-tool-plugins-maven-packaging)
* go to app main directory
* run `mvn clean package`

### run-dependencies
* [java se runtime environment >=1.8](http://www.oracle.com/technetwork/java/javase/overview/index.html)

### run-steps
* go to app main directory
* execute `java -jar target/battleship44-0.1.jar`

##changelog 
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
- front: re-written & refactored js to TypeScript(compiled as ES6) (Chrome52+ tested)  
  
v1.x  
- back/front: info which ship sizes are already shot & which are still to shoot down  
- back/front: mini chat in game, between players  
  
v2.0  
- back/front: fleet-type is now game-level, not server-level  
- back/front: grid-size is now game-level, not server-level  
  
v2.1  
- back/front: able to set custom (game-level) fleet-type (sizes) & grid-size  

##protocol

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
← `YOU_ [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2]`  
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
