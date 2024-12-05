import { randomUUID, UUID } from "crypto";
import { Socket } from "socket.io";

export class Player {
    private readonly id: UUID;
    private readonly type: string; // X or O
    private myTurn: boolean;
    private readonly client: Socket;

    constructor(type: string, myTurn: boolean, client: Socket) {
        this.id = randomUUID();
        this.type = type;
        this.myTurn = myTurn;
        this.client = client;
    }

    public getId(): UUID {
        return this.id;
    }

    public getType(): string {
        return this.type;
    }

    public getMyTurn(): boolean {
        return this.myTurn;
    }

    public setMyTurn(myTurn: boolean): void {
        this.myTurn = myTurn;
    }

    public getClient(): Socket {
        return this.client;
    }
}