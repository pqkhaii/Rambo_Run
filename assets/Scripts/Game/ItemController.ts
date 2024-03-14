import { _decorator, Collider2D, Component, instantiate, Node, Prefab, randomRangeInt, Vec3 } from 'cc';
import { GameModel } from './GameModel';
const { ccclass, property } = _decorator;

@ccclass('ItemController')
export class ItemController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: Prefab})
    private prefabShield: Prefab;

    @property({type: Prefab})
    private prefabTnt: Prefab;

    @property({type: Prefab})
    private prefabPlane: Prefab;

    @property({type: Node})
    private nodeItem: Node;

    private itemShield: Node;
    private itemTnt: Node;
    private itemPlane: Node;

    private nextitem: number = 0;
    private nextitem2: number = 0;
    private nextitem3: number = 0;

    private itemrate: number = 30000;
    private itemrate2: number = 35000;
    private itemrate3: number = 40000;

    protected start(): void {
        this.createItem();
    }

    protected update(deltaTime: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            this.moveItemShield(deltaTime);
            this.moveItemTnt(deltaTime);
            this.moveItemPlane(deltaTime);
        }
    }

    protected createItem(): void {
        //create Shield
        this.itemShield = instantiate(this.prefabShield);
        this.itemShield.parent = this.nodeItem;
        this.itemShield.setPosition(740, -10, 0.0);

        //create TNT
        this.itemTnt = instantiate(this.prefabTnt);
        this.itemTnt.parent = this.nodeItem;
        this.itemTnt.setPosition(1040, -10, 0.0);

        //create Plane
        this.itemPlane = instantiate(this.prefabPlane);
        this.itemPlane.parent = this.nodeItem;
        this.itemPlane.setPosition(2060, -10, 0.0);
    }

    protected checkStatus(item: Node): Node {
        if(item.active === false){
            return item;
        }
        return null;
    }
    
    protected moveItemShield(number: number): void {
        if(Date.now() > this.nextitem){
            this.nextitem = Date.now() + this.itemrate;

            if(this.checkStatus(this.itemShield) !== null){
                const shieldChild = this.checkStatus(this.itemShield);
                shieldChild.active = true;
                shieldChild.position = new Vec3(550, -5, 0.0);
                shieldChild.getComponent(Collider2D).apply();
            }
        }
        
        var posX = this.itemShield.getPosition().x;
        var posY = this.itemShield.getPosition().y;

        posX -= this.GameModel.SpeedBackground * number;

        if(posX <= -750){
            posX = 750;
            // posY = -5;
        }
        this.itemShield.setPosition(posX, posY, 0.0)
        this.itemShield.getComponent(Collider2D).apply();
    }

    protected moveItemTnt(number: number): void {
        if(Date.now() > this.nextitem2){
            this.nextitem2 = Date.now() + this.itemrate2;

            if(this.checkStatus(this.itemTnt) !== null){
                const tntChild = this.checkStatus(this.itemTnt);
                tntChild.active = true;
                tntChild.position = new Vec3(700, -5, 0.0);
                tntChild.getComponent(Collider2D).apply();
            }
        }
        
        var posX = this.itemTnt.getPosition().x;
        var posY = this.itemTnt.getPosition().y;

        posX -= this.GameModel.SpeedBackground * number;

        if(posX <= -750){
            posX = 790;
            // posY = -5;
        }
        this.itemTnt.setPosition(posX, posY, 0.0)
        this.itemTnt.getComponent(Collider2D).apply();
    }

    protected moveItemPlane(number: number): void {
        if(Date.now() > this.nextitem3){
            this.nextitem3 = Date.now() + this.itemrate3;

            if(this.checkStatus(this.itemPlane) !== null){
                const PlaneChild = this.checkStatus(this.itemPlane);
                PlaneChild.active = true;
                PlaneChild.position = new Vec3(800, -5, 0.0);
                PlaneChild.getComponent(Collider2D).apply();
            }
        }
        
        var posX = this.itemPlane.getPosition().x;
        var posY = this.itemPlane.getPosition().y;

        posX -= this.GameModel.SpeedBackground * number;

        if(posX <= -750){
            posX = 800;
            // posY = -5;
        }
        this.itemPlane.setPosition(posX, posY, 0.0)
        this.itemPlane.getComponent(Collider2D).apply();
    }
}