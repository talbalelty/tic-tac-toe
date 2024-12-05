import { UUID } from "crypto";
import { Player } from "../room/player";

export class RoomDto {
    board: string[][];
    playerId: UUID;
    roomId: UUID;
    myTurn: boolean;
    status: RoomStatus;

    constructor(roomId: UUID, board: string[][], player: Player) {
        this.roomId = roomId;
        this.board = board;
        this.playerId = player.getId();
        this.myTurn = player.getMyTurn();
        this.status = RoomStatus.PLAYING;
    }
}

export enum RoomStatus { YOU_WIN = 'You Win', YOU_LOST = 'You Lost', DRAW = 'Draw', PLAYING = 'Playing' }
