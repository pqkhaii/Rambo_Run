import { _decorator, Button, CCFloat, Component, director, Node, RigidBody2D, sys, Vec2, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {

    @property({type: CCFloat})
    private speedOfEnemy: number = 300;

    @property({type: CCFloat})
    private speedBackground: number = 250;

    @property({type: CCFloat})
    private speedGround: number = 200;

    @property({type: CCFloat})
    private speedPlane: number = 180.0;

    // @property({type: CCFloat})
    // private speedItem: number = 200.0;

    private isOver: boolean;
    private isStopUpdate: boolean = false;
    private isPlay: boolean = false;
    private isPause: boolean = false;

    private isHoldRun: boolean = false;

    private isAttack: boolean = false;

    private isPauseChecklog: boolean = true;

    //player
    @property({type: CCFloat})
    private fireRate: number = 200;
    private speedAnimPlayer: number = 1;

    //----------- GET / SET -----------//
    public get SpeedOfEnemy() : number {
        return this.speedOfEnemy;
    }
    public set SpeedOfEnemy(value : number) {
        this.speedOfEnemy = value;
    }

    public get SpeedBackground() : number {
        return this.speedBackground;
    }
    public set SpeedBackground(value : number) {
        this.speedBackground = value;
    }

    public get SpeedGround() : number {
        return this.speedGround;
    }
    public set SpeedGround(value : number) {
        this.speedGround = value;
    }

    public get SpeedPlane() : number {
        return this.speedPlane;
    }
    public set SpeedPlane(value : number) {
        this.speedPlane = value;
    }

    public get IsOver() : boolean {
        return this.isOver;
    }
    public set IsOver(value : boolean) {
        this.isOver = value;
    }

    public get IsStopUpdate() : boolean {
        return this.isStopUpdate;
    }
    public set IsStopUpdate(value : boolean) {
        this.isStopUpdate = value;
    }

    public get IsPause() : boolean {
        return this.isPause;
    }
    public set IsPause(value : boolean) {
        this.isPause = value;
    }

    public get IsPlay() : boolean {
        return this.isPlay;
    }
    public set IsPlay(value : boolean) {
        this.isPlay = value;
    }

    // public get SpeedItem() : number {
    //     return this.speedItem;
    // }
    // public set SpeedItem(value : number) {
    //     this.speedItem = value;
    // }

    public get IsHoldRun() : boolean {
        return this.isHoldRun;
    }
    public set IsHoldRun(value : boolean) {
        this.isHoldRun = value;
    }

    public get IsAttack() : boolean {
        return this.isAttack;
    }
    public set IsAttack(value : boolean) {
        this.isAttack = value;
    }

    public get FireRate() : number {
        return this.fireRate;
    }
    public set FireRate(value : number) {
        this.fireRate = value;
    }

    public get SpeedAnimPlayer() : number {
        return this.speedAnimPlayer;
    }
    public set SpeedAnimPlayer(value : number) {
        this.speedAnimPlayer = value;
    }

    public get IsPauseChecklog(): boolean {
        return this.isPauseChecklog;
    }
    public set IsPauseChecklog(value : boolean) {
        this.isPauseChecklog = value;
    }
    //----------------------------------//
}