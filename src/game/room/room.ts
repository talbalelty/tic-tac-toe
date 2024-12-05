import { randomUUID, UUID } from "crypto";
import { Board } from "./board";
import { Player } from "./player";
import { Socket } from "socket.io";

export class Room {
    private readonly id: UUID;
    private readonly playerX: Player;
    private playerO: Player;
    private readonly board: Board;

    constructor(client: Socket) {
        this.id = randomUUID();
        this.board = new Board();
        this.playerX = new Player('X', true, client);
    }

    public getId(): UUID {
        return this.id;
    }

    public getPlayerX(): Player {
        return this.playerX;
    }

    public getPlayerO(): Player {
        return this.playerO;
    }

    public setPlayerO(client: Socket): void {
        this.playerO = new Player('O', false, client);
    }

    public getBoard(): Board {
        return this.board;
    }

    // checking if the played move is valid
    public setBoard(newBoard: string[][]): void {
        this.board.setBoard(newBoard);
    }
}