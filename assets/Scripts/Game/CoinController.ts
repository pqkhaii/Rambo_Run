import { _decorator, Collider2D, Component, instantiate, Node, Prefab, random, randomRangeInt, Vec3 } from 'cc';
import { Constants } from './Constants';
import { GameModel } from './GameModel';
const { ccclass, property } = _decorator;

@ccclass('CoinController')
export class CoinController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: Prefab})
    private prefabCoin: Prefab;

    @property({type: Node})
    private nodeCoin: Node;

    private poolCoin: Node[] = [];

    //------GET / SET------//
    public get PoolCoin() : Node[] {
        return this.poolCoin;
    }
    
    public set PoolCoin(value : Node[]) {
        this.poolCoin = value;
    }
    /////////////////////////

    protected start(): void {
        this.createCoin();
    }

    protected update(dt: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            this.moveCoin(dt);
        }
    }

    protected createCoin(): void {
        for(let i = 0; i < Constants.numOfCoin; i++){
            const coin = instantiate(this.prefabCoin);
            coin.parent = this.nodeCoin;
            this.poolCoin.push(coin);
            
            var posX = 750 + (i * 80);

            coin.setPosition(posX, -60, 0.0);
            coin.getComponent(Collider2D).apply();
        }
    }

    protected checkStatusCoin(): Node {
        for(let i = 0; i < this.poolCoin.length; i++){
            if(this.poolCoin[i].active === false){
                return this.poolCoin[i];
            }
        }
        return null;
    }

    protected moveCoin(number: number): void {
        var random = randomRangeInt(750, 1000)

        if(this.checkStatusCoin() !== null){
            const coinChild = this.checkStatusCoin();
            coinChild.active = true;
            coinChild.position = new Vec3(random, -60, 0.0);
            coinChild.getComponent(Collider2D).apply();
        }

        for(let i = 0; i < this.poolCoin.length; i++){
            var posX = this.poolCoin[i].getPosition().x;
            var posY = this.poolCoin[i].getPosition().y;

            if(posX === posX){
                posX +60;
            }

            posX -= 200 * number;
            posY = -60;

            if(posX <= -750){
                posY = -60;
                posX = random;
            }
            this.poolCoin[i].setPosition(posX, posY, 0.0)
            this.poolCoin[i].getComponent(Collider2D).apply();
        }
    }
}

