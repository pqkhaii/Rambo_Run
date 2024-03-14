import { _decorator, CCFloat, Component, Node, Sprite, v3 } from 'cc';
import { GameModel } from './GameModel';
const { ccclass, property } = _decorator;

@ccclass('BackgroundController')
export class BackgroundController extends Component {
    
    @property({type: GameModel})
    private GameModel: GameModel;

    private bgStartPositionX: number;
    private gStartPositionX: number;

    private bgOffsetX: number = 0.0;
    private gOffsetX: number = 0.0;

    private spriteWidthBackground: number;
    private spriteWidthGround: number;

    @property({type: Node})
    private nodeBackground: Node;

    @property({type: Node})
    private nodeGround: Node;

    protected onLoad(): void {
        this.spriteWidthBackground = this.nodeBackground.getComponent(Sprite).spriteFrame.width;
        this.spriteWidthGround = this.nodeGround.getComponent(Sprite).spriteFrame.width;
    }

    protected start(): void {
        this.bgStartPositionX = this.nodeBackground.position.x;
        this.gStartPositionX = this.nodeGround.position.x;
    }

    protected update(dt: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            this.bgOffsetX += this.GameModel.SpeedBackground * dt;
            this.gOffsetX += this.GameModel.SpeedGround * dt;
    
            let offset: number = 0.0;
    
            if (this.bgOffsetX > this.spriteWidthBackground){
                offset = this.bgOffsetX - this.spriteWidthBackground;
                this.bgOffsetX = 0.0;
            }
            if (this.gOffsetX > this.spriteWidthGround){
                offset = this.gOffsetX - this.spriteWidthGround;
                this.gOffsetX = 0.0;
            }
    
            this.nodeBackground.position = v3(this.bgStartPositionX - this.bgOffsetX - offset, this.nodeBackground.position.y, this.nodeBackground.position.z);
            this.nodeGround.position = v3(this.gStartPositionX - this.gOffsetX - offset, this.nodeGround.position.y, this.nodeGround.position.z);
        }
    }
}