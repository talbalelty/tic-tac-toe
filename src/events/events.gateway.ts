import { Logger, ValidationPipe } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDto } from 'src/game/dto/room.dto';
import { GameService } from 'src/game/game.service';

@WebSocketGateway(3000)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(EventsGateway.name);

    constructor(private readonly gameService: GameService) {}

    handleConnection(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client connected`);
        this.gameService.addToRoom(client);
    }

    handleDisconnect(client: any) {
        // TODO - implement remove from room
        throw new Error('Method not implemented.');
    }

    // We assume the player was authenticated and we have the roomDto
    @SubscribeMessage('playTurn')
    handlePlayTurn(@MessageBody() roomDto: RoomDto): void {
        this.logger.log(roomDto);
        this.gameService.playTurn(roomDto);
    }
}