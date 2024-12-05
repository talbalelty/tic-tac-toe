import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { RoomDto } from "./dto/room.dto";

@Injectable()
export class GameGateway {
    public emitWaiting(client: Socket, roomDto: RoomDto) {
        client.emit('waiting', roomDto);
    }

    public emitPlay(client: Socket, roomDto: RoomDto) {
        client.emit('play', roomDto);
    }

    public emitBadMove(client: Socket, error: Error) {
        client.emit('badMove', error.message);
    }

    public emitGameOver(client: Socket, roomDto: RoomDto) {
        client.emit('gameOver', roomDto);
    }
}