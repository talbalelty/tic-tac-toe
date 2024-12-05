import { Injectable, Logger } from "@nestjs/common";
import { UUID } from "crypto";
import { Room } from "./room/room";
import { Socket } from "socket.io";
import { RoomDto, RoomStatus } from "./dto/room.dto";
import { GameGateway } from "./game.gateway";

@Injectable()
export class GameService {
    private readonly logger = new Logger(GameService.name);

    private readonly pendingRooms: Room[] = [];
    private readonly fullRooms: Map<UUID, Room> = new Map();
    

    constructor(private readonly gameGateway: GameGateway) {
        this.logger.log('here');
    }

    public addToRoom(client: Socket): void {
        if (this.pendingRooms.length === 0) {
            this.createNewRoom(client);
        } else {
            this.addToPendingRoom(client);
        }
    }

    public playTurn(roomDto: RoomDto) {
        const room = this.fullRooms.get(roomDto.roomId);
        if (!room) {
            this.logger.error('Room not found');
            return;
        }

        const player = roomDto.playerId === room.getPlayerX().getId() ? room.getPlayerX() : room.getPlayerO();
        if (!player) {
            this.logger.error('Player not found');
            return;
        }

        if (player.getMyTurn()) {
            this.logger.log('Player is allowed to play');
            try {
                this.processTurn(room, roomDto);
            } catch (error) {
                this.gameGateway.emitBadMove(player.getClient(), error);
            }
        } else {
            this.logger.error('Player is not allowed to play');
        }
    }

    private processTurn(room: Room, roomDto: RoomDto) {
        room.setBoard(roomDto.board);
        room.getPlayerX().setMyTurn(!room.getPlayerX().getMyTurn());
        room.getPlayerO().setMyTurn(!room.getPlayerO().getMyTurn());
        const xRoomDto = new RoomDto(room.getId(), room.getBoard().getBoard(), room.getPlayerX());
        const oRoomDto = new RoomDto(room.getId(), room.getBoard().getBoard(), room.getPlayerO());
        switch (room.getBoard().checkWinner()) {
            case 'X':
                this.logger.log('X wins');
                xRoomDto.status = RoomStatus.YOU_WIN;
                this.gameGateway.emitGameOver(room.getPlayerX().getClient(), xRoomDto);
                oRoomDto.status = RoomStatus.YOU_LOST;
                this.gameGateway.emitGameOver(room.getPlayerO().getClient(), oRoomDto);
                this.fullRooms.delete(room.getId());
                break;
            case 'O':
                this.logger.log('O wins');
                xRoomDto.status = RoomStatus.YOU_LOST;
                this.gameGateway.emitGameOver(room.getPlayerX().getClient(), xRoomDto);
                oRoomDto.status = RoomStatus.YOU_WIN;
                this.gameGateway.emitGameOver(room.getPlayerO().getClient(), oRoomDto);
                this.fullRooms.delete(room.getId());
                break;
            case 'draw':
                this.logger.log('Draw');
                xRoomDto.status = RoomStatus.DRAW;
                oRoomDto.status = RoomStatus.DRAW;
                this.gameGateway.emitGameOver(room.getPlayerX().getClient(), xRoomDto);
                this.gameGateway.emitGameOver(room.getPlayerO().getClient(), oRoomDto);
                this.fullRooms.delete(room.getId());
                break;
            default:
                this.logger.log('Continue playing');
                this.gameGateway.emitPlay(room.getPlayerX().getClient(), xRoomDto);
                this.gameGateway.emitPlay(room.getPlayerO().getClient(), oRoomDto);
                break;
        }
    }

    private createNewRoom(client: Socket): void {
        this.logger.log('Creating a new room');
        const room = new Room(client);
        this.pendingRooms.push(room);
        this.gameGateway.emitWaiting(client, new RoomDto(room.getId(), room.getBoard().getBoard(), room.getPlayerX()));
    }

    private addToPendingRoom(client: Socket): void {
        this.logger.log('Adding to pending room');
        const room = this.pendingRooms.shift();
        if (!room) {
            this.logger.error('Room is undefined');
            return;
        }

        room.setPlayerO(client);
        this.fullRooms.set(room.getId(), room);
        this.logger.log('Room is full, starting the game');
        this.gameGateway.emitPlay(client, new RoomDto(room.getId(), room.getBoard().getBoard(), room.getPlayerO()));
        this.gameGateway.emitPlay(room.getPlayerX().getClient(), new RoomDto(room.getId(), room.getBoard().getBoard(), room.getPlayerX()));
        this.logger.log('Game started for both players');
    }
}