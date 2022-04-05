# Identical
This is a prototype for a cooperative turn-based game with asymetric roles made to be played remotely with multiple devices. It was developed by BBC R&D over the course of a year to experiment with principles of board game design and how they might affect how we design software interfaces that generate togetherness and social connection.

The game can be played with 2 to 6 players where each player controls a different character, with its own strengths and weaknesses, and together they have to overcome a series of challenges to advance the story.

The game is built with [boardgame.io](https://github.com/boardgameio/boardgame.io), a framework to build turn-based games and is wrapped into a Next.js application that uses [Tailwind](https://github.com/tailwindlabs/tailwindcss) for styling and [Framer Motion](https://github.com/framer/motion) for animations. The code contains many artifacts betraying its prototype nature — the code quality and organisation will reflect that.

## Running the game
You will need to run a server (`npm run serve`) and a client (`npm start`) to play with other players. You will need to host it somewhere on the internet if you want to play with other people remotely.

For development, you can use `npm run serve-dev` which will automatically reload the server when server-related files (e.g. the game logic) changes and `npm run dev` to automatically reload the client when you make changes to client files (e.g. UI components).

You can change the host and port of the server through environment variables `HOST` and `PORT`.

### Single Screen vs Multi-Screen
The game comes in 2 flavours: multi-screen and single screen. 

The game was originally designed as multi-screen, where one screen would act as the board and could be shared either physically (like couch co-op) or on Zoom. Then each player needs a mobile device they will use to join the game and control their character.

In preparation for an experiment looking into the benefits of multi-screen, we built a single screen version to compare against. This version only needs one device (one desktop or laptop computer) per player as it displays the board and the character sheet in the same browser window. The single screen version is accessible by using the [`/single`](/pages/single/) urls.

### Routes
The game has 2 sets of routes, one for multi-screen and one for single screen. They can be found in the [`pages`](/pages/) folder.

*Multi-Screen*
`/index` or `/` — To create a new game or join a new one with a join code.
`/watch/[code]` — To be loaded on the main screen. Acts as lobby and will load the board once everyone has joined.
`/join/[code]` — To be loaded on the secondary screen. Allows you to choose your nickname, be given a playerId and join the game.
`/play/[code]/[playerId]` — To be loaded on the secondary device. Main playing screen from which to send actions and interact with the board.

*Single Screen*
`/single` — To create or join a new single screen game.
`/join/[code]` — Allows you to choose your nickname, be given a playerId and join the game.
`/play/[code]/[playerId]` — Displays the board and player screen on the same view.

## Story
The game takes place in a cyber-punk universe where the players have been sent to a mysterious government facility to investigate the disappearance of the previous crew.

The story is structured in 3 episodes, each composed of multiple chapters. Each chapter represents a part of the story as well an objective to accomplish. The objective is the same for everyone and everyone has to complete it together. They also have to complete the objectives as quickly as they can because the facility's system is corrupted and will periodically make their situation worse.

You can change the story, objectives and corruption in [`story.js`](/game/story.js) which details the data structure.

### Maps
Each episode takes place on a fixed map composed of rooms. The map starts completely hidden and progressively reveals itself as players move around the different rooms. A room might contain enemies, a computer terminal or both (or nothing!). Some rooms are locked and will need to be lockpicked to access them. A few rooms also have a single or double letter label which usually indicates an important room for an objective.

The maps are described by JSON files which you can find in the [game](/game) folder. As the maps use SVG to render the outline of the rooms and what is inside, we developed a way to design the map in a vector software and then run them through a command line tool which will generate the appropriate JSON. This means that the maps rely on particular element shape, size and colours to define what is represented. 

This is detailed in the code to transform the SVG into JSON [`svg-to-data`](/game/svg-to-data.js) and in [`board-data-structure`](/game/board-data-structure.js). You can see examples of SVG maps in the [game](/game) folder.

## Game Design & Rules
The in-depth rules of the game are explained in [`Rules.js`](/components/Rules.js) but if you'd like to change the game design, the business logic is all inside [`Identical`](/game/Identical.js). If this is your first time looking at a [boardgame.io](https://github.com/boardgameio/boardgame.io) project, please look at their documentation to understand how it's structured.

The game is composed of 4 distinct phases: the setup, the crew phase, the encounter and the corruption.

The setup phase only happens once at the beginning of every episode. This is where everyone chooses their character and where the game is setup.

In the crew phase, every player takes turn to do a few actions. However, they first have to decide wether to open the comms (allowing them to chat with other players about strategy) or close them (where they have to make their decisions on their own). If they choose not to open the comms, they get an upgrade. This is to help mitigate quarterbacking but isn't enforced through the game. Then the active player can choose to do a few things: move to another room, use a skill (hack, lockpick or neutralise), get an upgrade, request an upgrade from another player or use an upgrade.

During the crew phase, the players are trying to complete an objective which usually involves exploring the map and using a combination of skills.

Once every players has either played all their actions or passed, the encounter phase begins. In the encounter, each player is subjected to a random check which will decide if anything happens to them (if they've been found by the security system).

And when every player has acknowledged the effects of the encounter, the corruption happens. During the corruption every player sees whether they've been attacked or not (they will be attacked if an enemy is in the same room as them). Then the enemies may randomly move to a neighbouring room. If a player's stamina falls to 0 or less, they are transported to the starting location with a few extra actions and all their health. More importantly, the corruption level is increased and if it reaches the threshold for this particular chapter, it will trigger adverse effects.

Then the crew phase starts again. The game finished when the players have completed all the objectives of an episodes or the corruption has reached its threshold too many times.

## UI
The game is a React (Next.js) application. It uses [Framer Motion](https://github.com/framer/motion) for animations and [bgio-effects](https://github.com/delucis/bgio-effects) to trigger them in response to moves. The two main parts are the spectator board and the player board.

The spectator board renders the state held in [boardgame.io](https://github.com/boardgameio/boardgame.io) and shows to every player what is happening. It can also be used by non-playing spectators to "watch" the game. It contains the map (including terminals, locks and enemies — called cogs), displays the objective, corruption and story as well as various animations. It is not interactive and only reacts to changes in state from boardgame.io.

The spectator board is also where sounds are played from (using [Howler](https://github.com/goldfire/howler.js)). There are two types of sounds: background music and spot sounds. The background music is on all the time and changes depending on which phase the game is in. The spot sounds are played as needed.

The player board is interactive and is different for each player. It shows their stats, their upgrades (called boosts) and the list of actions they can do. All the actions are dispatched from the player board.

Some components need to look and feel different based on whether it's being played on a single screen or with multiple screens. To allow for this, some components will render differently based on that. The folders [`multi`](/components/multi/) and [`single`](/components/single/) inside [`components`](/components/) include all the components that are different. They're usually called by a similarly named component in the main [`components`](/components/) folder which will choose which one to render based on a prop.

### Development Options
The game includes configurable options useful for development that you can toggle in [`game-config.js`](/game/game-config.js).

If `skipLobby` is turned on, the game starts straight away with default characters and skips the introduction to the story. If `skipEncounter` is on, the encounter phase where you have to scratch to reveal what negative thing happens to your character is skipped. `skipBlockScreen` means the blocking overlay usually displayed during an important action will not appear (any move you make will stop the animation and get to the next state immediately). `boostCharacters` gives you overpowers characters meaning you are less likely to fail skill tests. When `showMap` is on, the whole map is visible even if not explored (useful when developing and trying out new maps).

## Known Issues
This is a prototype and therefore it has a few rough edges. This is a non-exhaustive list of the issues you might encounter:

- The game doesn't go from one episode to another automatically, you have to change it in the code manually. It also repeats the last story screen twice when the game ends.
- The state of the games are not saved to a database, rather they're saved in memory (if the server restarts, all progress is lost).
- The game doesn't work very well on mobile devices running low on battery — the screen needs to be on for the duration of the game or some animations might glitch. Reloading the browser usually fixes it.
- The game comes with music and sounds but some browser seem to struggle with it over time. The sound might start to stutter or crackle. Reloading the browser usually fixes it.
- The lobby doesn't use the boardgame.io lobby API which at the time didn't allow the joining flow we wanted. As result, the implementation is a little hacky.

## Credits & Licences
Mathieu Triay and Andrew Wood designed the game (concept, UI & UX) and wrote the story.
The game design is very much indebted to modern classics of the co-op genre, including Pandemic and Arkham Horror: The Living Card Game.

The character illustrations were drawn by [Rob Turpin](https://www.instagram.com/thisnorthernboy/). All other illustrations were adapted from patent drawings. Circuit board pattern adapted from [Pixabay](https://pixabay.com/vectors/computer-cyber-circuitry-circuits-3163436/).

All icons are original except [Fanned cards](https://github.com/Templarian/MaterialDesign), [Sound on/off](https://github.com/vmware/clarity), [Chip](https://github.com/ionic-team/ionicons), [Lock](https://github.com/atisawd/boxicons), [Heart](https://github.com/twbs/icons).

The background music come from royalty-free music made available on Youtube by Wee Free Music (https://youtu.be/rpMvf4Gdn-4 and https://youtu.be/a6v-RL5ypR4). The spot sounds are sourced from royalty-free effects provided by [Sonniss](https://sonniss.com/gameaudiogdc) — they were cut and mixed as needed.

The source code of this project is licenced under the [BSD-3-Clause](/LICENSE). The story (including text and audio), as well as the characters and their illustrations and any other remaining visual or audio assets are licenced under our [bespoke BBC Licence]().

Thanks to everyone who play tested this and helped us refine what we think is a fun game and a great experiment. Thanks particularly to those who reviewed this paper, took part in the play testing and provided invaluable feedback and support: Florian Bœuf, Dr Elsa Call, Dr Maxime Courcelle, Sébastien Gatty, Dr Alana Laing and Dr Cécile Triay.