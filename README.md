# Tic Tac Toe
## Description

This is a cooperative tic tac toe game that runs on NestJs Websocket and played with Postman

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ nest start
```

Steps to play the game:
1. In Postman, open two socket.io requests
2. Connect to url: ws://localhost:3000
3. To both requests add the following events: waiting, play, gameOver, badMove
4. Type the event "playTurn" in the right side
5. Change the request message type from text to JSON
6. Use the Room dto that was sent in the play event, update your desired choice X and send it in the message event
7. Move to the second request of player O and repeat step 6
