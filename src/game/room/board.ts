const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

export class Board {
    private board: string[][];

    constructor() {
        this.board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    }

    public getBoard(): string[][] {
        return this.board;
    }

    public setBoard(newBoard: string[][]): void {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] !== newBoard[i][j] && this.board[i][j] !== '') {
                    throw new Error(`Invalid move at ${i}, ${j}`);
                }
            }
        }
        this.board = newBoard;
    }

    // check if tic-tac-toe is won
    public checkWinner(): string {
        const flatBoard = this.board.flat();
        // check draw
        if (!flatBoard.includes('')) {
            return 'draw';
        }

        for (const [a, b, c] of winningConditions) {
            if (flatBoard[a] && flatBoard[a] === flatBoard[b] && flatBoard[a] === flatBoard[c]) {
                return flatBoard[a];
            }
        }
        return '';
    }
}