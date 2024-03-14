import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants extends Component {
    
    public static readonly keyScore: string = 'score';
    public static readonly keyVolume: string = 'volume';

    public static readonly sceneEntry: string = 'Entry';
    public static readonly sceneGame: string = 'Game';
    public static readonly sceneMenu: string = 'Menu';

    public static readonly MyNode: string = 'MyNode';

    public static readonly numOfBullet: number = 3;

    public static readonly numOfCoin: number = 6;

    public static readonly numOfEnemy1: number = 5;
    public static readonly numOfEnemy2: number = 3;
    public static readonly numOfEnemy3: number = 3; //2
    public static readonly numOfEnemy4: number = 3;

    public static readonly numOfExplosion: number = 20;
    public static readonly numOfCoinCollect: number = 20;

    public static volume: boolean = true;
    public static newGame: boolean = true;

    //------------------ALL TAG----------------------//
    // - tag = 1 : bullet plane
    // - tag = 2 : Coin
    // - tag = 3 : Enemy 1
    // - tag = 4 : Enemy 2
    // - tag = 5 : Tnt Coin
    // - tag = 6 : item Shield
    // - tag = 7 : bullet
    // - tag = 8 : boom
    // - tag = 9 : enemy's weapon
    //-----------------------------------------------//
}