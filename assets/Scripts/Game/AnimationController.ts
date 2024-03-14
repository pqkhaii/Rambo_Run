import { _decorator, Component, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('AnimationController')
export class AnimationController extends Component {
    @property({type: Node})
    private nodeAnimation: Node;
    
    @property({type: Prefab})
    private prefabExplode: Prefab;

    private poolExplode: Node[] = [];

    @property({type: Prefab})
    private prefabBulletPlane: Prefab;

    private poolBulletPlane: Node[] = [];
    
    @property({type: Prefab})
    private prefabCoinCollect: Prefab;

    private poolCoinCollect: Node[] = [];

    start() {
        this.createExplode();
        this.createCoinCollect();
        this.createExplodeBulletPlane();
    }

    protected createExplode(): void {
        for(let i = 0; i < Constants.numOfExplosion; i++){
            const explode = instantiate(this.prefabExplode);
            explode.parent = this.nodeAnimation;
            explode.active = false;
            explode.position = new Vec3(0,0,0);
            this.poolExplode.push(explode);
        }  
    }

    public checkStatusExplode(): Node {
        for(let i = 0; i < this.poolExplode.length; i++){
            if(this.poolExplode[i].active === false){
                return this.poolExplode[i];
            }
        }
        return null;
    }

    //call on Explosion
    public handleExplosion(otherCollider: Node): void {
        const explodeChild = this.checkStatusExplode();
        explodeChild.active = true;
        explodeChild.position = otherCollider.position;
        this.schedule(() => {
            explodeChild.active = false;
        },0,0,0.20);
    }

    //----------------------Animation Bullet Plane------------------------//
    protected createExplodeBulletPlane(): void {
        for(let i = 0; i < Constants.numOfExplosion; i++){
            const explode = instantiate(this.prefabBulletPlane);
            explode.parent = this.nodeAnimation;
            explode.active = false;
            explode.position = new Vec3(0,0,0);
            this.poolBulletPlane.push(explode);
        }  
    }

    public checkStatusExplodeBulletPlane(): Node {
        for(let i = 0; i < this.poolBulletPlane.length; i++){
            if(this.poolBulletPlane[i].active === false){
                return this.poolBulletPlane[i];
            }
        }
        return null;
    }

    //call on Explosion
    public handleExplosionBulletPlane(otherCollider: Node): void {
        const explodeChild = this.checkStatusExplodeBulletPlane();
        explodeChild.active = true;
        const positionX = otherCollider.position.x;
        const positionY = otherCollider.position.y;
        explodeChild.position = v3(positionX, positionY, 0.0);
        this.schedule(() => {
            explodeChild.active = false;
        },0,0,0.20);
    }

    //
    //call on Explosion Bullet vs Enemy's weapon
    public handleExplosionWeaponEnemy(otherCollider: Node): void {
        const explodeChild = this.checkStatusExplodeBulletPlane();
        explodeChild.active = true;
        const positionX = otherCollider.position.x;
        const positionY = otherCollider.position.y;
        explodeChild.position = v3(positionX - 50, positionY, 0.0);
        this.schedule(() => {
            explodeChild.active = false;
        },0,0,0.20);
    }

    //----------------------Animation Coin------------------------//
    protected createCoinCollect(): void {
        for(let i = 0; i < Constants.numOfCoinCollect; i++){
            const coinCollect = instantiate(this.prefabCoinCollect);
            coinCollect.parent = this.nodeAnimation;
            coinCollect.active = false;
            coinCollect.position = new Vec3(0,0,0);
            this.poolCoinCollect.push(coinCollect);
        }  
    }

    public checkStatusCoinCollect(): Node {
        for(let i = 0; i < this.poolCoinCollect.length; i++){
            if(this.poolCoinCollect[i].active === false){
                return this.poolCoinCollect[i];
            }
        }
        return null;
    }

    //call explosion
    public handleCoinCollect(otherCollider: Node): void {
        const coinCollect = this.checkStatusCoinCollect();
        coinCollect.active = true;
        const positionX = otherCollider.position.x;
        const positionY = otherCollider.position.y + 50;
        coinCollect.position = v3(positionX, positionY, 0.0);
        this.schedule(() => {
            coinCollect.active = false;
        },0,0,0.20);
    }
}

