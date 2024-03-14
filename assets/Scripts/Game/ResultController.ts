import { _decorator, Component, find, Label, Node } from 'cc';
import { Constants } from './Constants';
import { StoreAPI } from '../Loading/StoreAPI';
import { DataUser } from '../Loading/DataUser';
const { ccclass, property } = _decorator;

@ccclass('ResultController')
export class ResultController extends Component {
    @property({type: Label})
    private labelScore: Label;

    @property({type: Label})
    private labelHighScore: Label;
    
    private scoreArray: number[] = [];
    private currentScore: number = 0;

    //-----GET / SET -----//
    public get ScoreArray() : number[] {
        return this.scoreArray;
    }
    public set ScoreArray(value : number[]) {
        this.scoreArray = value;
    }

    public get CurrentScore() : number {
        return this.currentScore;
    }
    //---------------------

    //API
    private gameClient: any;
    private userID: string

    protected onLoad(): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.userID = this.gameClient.user.citizen.getCitizenId();
    }

    protected updateScore(number: number): void {
        this.currentScore = number;
        this.labelScore.string = this.currentScore.toString();
    }
    
    public addScore(): void {
        this.updateScore(this.currentScore += 10);
    }

    public addScoreCoin(): void {
        this.updateScore(this.currentScore += 25);
    }

    public addScore2(): void {
        this.updateScore(this.currentScore += 20);
    }

    public async showResults(): Promise<void> {
        if (this.currentScore > DataUser.dataUser.data.highScore) {
            DataUser.dataUser.data.highScore = this.currentScore;
            await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
                .then((response: any) => {});
        }

        this.labelHighScore.string = `HIGH SCORE: ${DataUser.dataUser.data.highScore}`;
    }
}

