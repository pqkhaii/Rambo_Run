import { _decorator, animation, Button, Color, Component, director, EventKeyboard, EventTouch, find, game, input, Input, KeyCode, Label, math, Node, RigidBody2D, sp, Sprite, sys, Vec2 } from 'cc';
import { BulletController } from './BulletController';
import { Constants } from './Constants';
import { ResultController } from './ResultController';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { EnemyController } from './EnemyController';
import { PlayerController } from './PlayerController';
import { AudioController } from './AudioController';
import { StoreAPI } from '../Loading/StoreAPI';
import { DataUser } from '../Loading/DataUser';
import { LeaderboardHandle } from '../../Leaderboard/Scripts/LeaderboardHandle';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: GameView})
    private GameView: GameView;

    @property({type: BulletController})
    private BulletController: BulletController;

    @property({type: ResultController})
    private ResultController: ResultController;

    @property({type: PlayerController})
    private PlayerController: PlayerController;

    @property({type: AudioController})
    private AudioController: AudioController;

    @property({type: Node})
    private nodePlane: Node;

    @property({type: Node})
    private pauseGame: Node;
    
    @property({type: Button})
    private btnOnAudio: Button;

    @property({type: Button})
    private btnOffAudio: Button;

    @property({type: Button})
    private btnTryAgain: Button;

    @property({type: Button})
    private btnFire: Button;

    //leaderboard
    @property({type: LeaderboardHandle})
    private LeaderboardHandle: LeaderboardHandle;

    //API
    private gameClient;
    private matchData: any;
    private userID: string;

    private isTryAgain: boolean = false;

    protected onLoad(): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.matchData = gameClientParams.matchData;
        this.userID = this.gameClient.user.citizen.getCitizenId();
    }

    protected start(): void {   
        this.pauseGame.active = false;
        this.GameModel.IsOver = false;

        if(Constants.newGame === false){
            this.GameModel.IsPlay = true;
        }
        else{
            this.GameModel.IsPlay = false;
        }

        this.handleAudio();
        this.startMatchLog();
    }

    protected async update(deltaTime: number): Promise<void> {
        let _this = this;
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            //Check Game Over
            if(this.GameModel.IsOver === true){   
                this.gameOver();
                this.GameView.handleLoading(true);

                this.GameModel.IsPauseChecklog = false;
                this.logMatch({score: this.ResultController.CurrentScore});
                
                await _this.gameClient.match
                        .completeMatch(this.matchData, {score: this.ResultController.CurrentScore})
                        .then((data) => {
                            this.LeaderboardHandle.show(this.gameClient, this.userID);
                        })
                        .catch((error) => console.log(error));
                this.GameView.handleLoading(false);
                this.isTryAgain = true;
                input.on(Input.EventType.KEY_UP, this.onKeyTryAgain, this);
            }
            else{
                //Handle speed of game
                this.gameSpeed(deltaTime);
        
                //Move Plane
                if(this.nodePlane.active === true){
                    this.movePlane(deltaTime);
                }
            }
        }
    }

    //checklog
    protected logMatch(data: Object): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.gameClient.match.logMatch(this.matchData.matchId, data).catch((e) => console.log(e));
    }

    protected startMatchLog(): void {
        let id = setInterval(() => {
            if(this.GameModel.IsPauseChecklog === false){
                clearInterval(id);
                return;
            }
            this.logMatch({score: this.ResultController.CurrentScore});
        }, 1000);
    }

    //speed game
    protected gameSpeed(dt: number): void {
        const score = this.ResultController.CurrentScore;
        // if(score <= 500){
        //     this.speedControl(300, 250, 200, 200, 1);
        // }
        // else if(score > 500 && score <= 1000){
        //     this.speedControl(500, 450, 400, 160, 1.2);
        // }
        // else if(score > 1000 && score <= 1500){
        //     this.speedControl(400, 350, 300, 180, 1.1);
        // }
        // else if(score > 1500 && score <= 2500){
        //     this.speedControl(600, 550, 500, 140, 1.3);
        // }
        // else if(score > 2500 && score <= 3500){
        //     this.speedControl(500, 450, 400, 160, 1.1);
        // }
        // else{
        //     this.speedControl(700, 650, 600, 120, 1.4);
        // }
        if(score <= 2500){
            this.GameModel.SpeedOfEnemy += 0.1;
            this.GameModel.SpeedBackground += 0.1;
            this.GameModel.SpeedGround += 0.1;

            if(this.GameModel.SpeedAnimPlayer < 1.5){
                this.GameModel.SpeedAnimPlayer += 0.0001;
                this.PlayerController.node.getComponent(sp.Skeleton).timeScale = this.GameModel.SpeedAnimPlayer;
            }
            
            if(this.GameModel.FireRate >= 100){
                this.GameModel.FireRate -= 0.005;
            }
        }
    }

    // protected speedControl(speedEnemy: number, speedBackground: number, speedGround: number, fireRate: number, speedAnimPlayer: number): void {
    //     this.GameModel.SpeedOfEnemy = speedEnemy;
    //     this.GameModel.SpeedBackground = speedBackground;
    //     this.GameModel.SpeedGround = speedGround;
    //     this.GameModel.FireRate = fireRate;
    //     this.GameModel.SpeedAnimPlayer = speedAnimPlayer;

    //     this.PlayerController.node.getComponent(sp.Skeleton).timeScale = this.GameModel.SpeedAnimPlayer;
    // }

    protected handleAudio(): void {
        if(Constants.volume === true){
            this.btnOffAudio.node.active = false;
            this.btnOnAudio.node.active = true;
            this.AudioController.AudioSource.play();
            this.AudioController.settingAudio(1);
        }
        else{
            this.btnOffAudio.node.active = true;
            this.btnOnAudio.node.active = false;
            this.AudioController.AudioSource.stop();
            this.AudioController.settingAudio(0);
        }
    }

    //call plane
    protected movePlane(time: number): void{
        var positionX = this.nodePlane.position.x;
        var positionY = this.nodePlane.position.y;

        positionX += this.GameModel.SpeedPlane * time;

        if (positionX >= 600){
            this.nodePlane.active = false;
            positionX = -600;
            positionY = 160
        }

        this.nodePlane.setPosition(positionX, positionY, 0.0)
    }

    protected gameOver(): void {
        this.btnFire.interactable = false;
        this.GameModel.IsStopUpdate = true;
        this.GameView.showGameOVer();
    }

    protected onKeyTryAgain(event: EventKeyboard): void {
        if(this.isTryAgain === true){
            this.onTouchTryAgain();
            this.isTryAgain = false;
        }
    }

    //---------------------------------------------HANDLE BUTTON--------------------------------------------//

    protected async onTouchConfirm(): Promise<void> {
        this.GameModel.IsPlay = true;
        Constants.newGame = false;
        this.GameView.handleTutorial(false);
        DataUser.dataUser.data.tutorial = false;
        await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
        .then((response: any) => {});
    }

    protected onTouchOnAudio(): void {
        Constants.volume = true;

        this.AudioController.AudioSource.play();
        this.AudioController.settingAudio(1);

        this.btnOffAudio.node.active = false;
        this.btnOnAudio.node.active = true;
    }

    protected onTouchOffAudio(): void {
        Constants.volume = false;

        this.AudioController.AudioSource.stop();
        this.AudioController.settingAudio(0);

        this.btnOffAudio.node.active = true;
        this.btnOnAudio.node.active = false;
    }

    protected async onTouchTryAgain(): Promise<void> {
        this.btnTryAgain.interactable = false;
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);

        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        director.loadScene(Constants.sceneGame);
    }

    protected onTouchPause(): void {
        director.pause();
        this.pauseGame.active = true;
        this.GameModel.IsPause = true;
        this.btnOnAudio.interactable = true;
        this.btnOffAudio.interactable = true;
        
    }

    protected onTouchResume(): void {
        director.resume();
        this.pauseGame.active = false;
        this.GameModel.IsPause = false;
    }

    protected onTouchExit(): void {
        director.resume();
        director.loadScene(Constants.sceneEntry);
    }

    protected onTouchTutorial(): void {
        director.pause();
        this.GameView.handleTutorialInGame(true);
    }

    protected onTouchContinue(): void {
        director.resume();
        this.GameView.handleTutorialInGame(false);
    }
}