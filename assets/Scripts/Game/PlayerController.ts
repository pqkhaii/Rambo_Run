import { _decorator, AnimationClip, Collider2D, Component, Contact2DType, EventKeyboard, EventTouch, input, Input, IPhysics2DContact, KeyCode, Label, Node, RigidBody, RigidBody2D, Animation, Vec2, sp, v3, Button, Event, Vec3, Camera } from 'cc';
import { GameModel } from './GameModel';
import { ResultController } from './ResultController';
import { AudioController } from './AudioController';
import { CoinController } from './CoinController';
import { AnimationController } from './AnimationController';
import { BulletController } from './BulletController';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: AudioController})
    private AudioController: AudioController;

    @property({type: ResultController})
    private ResultController: ResultController;

    @property({type: CoinController})
    private CoinController: CoinController;
    
    @property({type: AnimationController})
    private AnimationController: AnimationController;

    @property({type: BulletController})
    private BulletController: BulletController;

    @property({type: EnemyController})
    private EnemyController: EnemyController;

    @property({type: Node})
    private nodePlane: Node;

    @property({type: Node})
    private nodeShield: Node;

    @property({type: Node})
    private nodeBoomExplosion: Node;

    @property({type: sp.Skeleton})
    private playerSkeleton: sp.Skeleton;

    @property({type: Node})
    private shootExplosion: Node;

    @property({type: Button})
    private btnRun: Button;

    @property({type: Node})
    private aim: Node;

    private checkCollectShield: boolean = false;

    //fire rate
    private nextfire: number = 0;
    // private firerate: number = 200;

    protected start(): void {
        this.nodeShield.active = false;

        this.playerSkeleton.setAnimation(0, 'run', true);
        this.playerSkeleton.setAnimation(1, 'aim', true);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.btnRun.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.btnRun.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btnRun.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        //Player collision
        const colliderPlayer = this.node.getComponent(Collider2D);
        if(colliderPlayer){
            colliderPlayer.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactPlayer, this)
        }

        //Shield collsion
        const collider = this.nodeShield.getComponent(Collider2D);
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactShield, this)
        }
    }

    protected update(dt: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            if(this.checkCollectShield === true){
                this.nodeShield.position = v3(this.node.position.x, this.node.position.y + 80, 0);
                this.nodeShield.active = true;
    
                setTimeout(()=>{
                    this.checkCollectShield = false;
                },5000)
            }
            else{
                this.nodeShield.active = false;
            }

            this.playerRun(dt);
            this.fireBulletCondition();
            this.node.angle = 0;
        }
    }

    protected fireBulletCondition(){
        var posXPlayer = this.node.position.x;
        var bone = this.playerSkeleton.findBone("cross-hair");
        for(let i = 0; i < this.EnemyController.PoolEnemies.length; i++){
            const enemy = this.EnemyController.PoolEnemies[i];
            var posXEnemy = enemy.position.x;

            var distance = Math.abs(posXPlayer - posXEnemy);

            if(distance <= 700 && enemy.active === true && (posXEnemy > (posXPlayer + 50))){ 
                if(Date.now() > this.nextfire){
                    this.nextfire = Date.now() + this.GameModel.FireRate;
                    this.BulletController.spawnBullet(this.node, enemy);

                    this.aim.position = enemy.position;
                    
                    bone.y = this.aim.worldPosition.y + 30;

                    this.shootExplosion.active = true;
                    this.schedule(() => {
                        this.shootExplosion.active = false;
                    },0,0,0.25);
                }
            }
        }
    }

    protected onKeyDown (event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.SPACE:
                this.playerJump();
                break;
            case KeyCode.ENTER:
                this.GameModel.IsHoldRun = true;
                break;
        }
    }

    protected onKeyUp (event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.SPACE:
                break;
            case KeyCode.ENTER:
                this.GameModel.IsHoldRun = false;
                break;
        }
    }

    protected onTouchStart(): void {
        this.GameModel.IsHoldRun = true;
    }

    protected onTouchEnd(): void {
        this.GameModel.IsHoldRun = false;
    }

    protected onTouchCancel(): void {
        this.GameModel.IsHoldRun = false;
    }

    //player behaviour
    protected playerRun(dt: number): void {
        var posX = this.node.position.x;
        var posY = this.node.position.y;

        if(this.GameModel.IsHoldRun === true){
            if(posX <= 500){
                posX += 400 *dt;
            }
        }else{
            if(posX >= -500){
                posX -= 400 *dt;
            }
        }
        this.node.setPosition(posX, posY, 0);
    }

    protected playerJump(): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPause === false){
            if(this.node.position.y <= -240){
                this.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0,22);
                this.playerSkeleton.setAnimation(0, 'jump-2', true);
                this.scheduleOnce(()=> {
                    this.playerSkeleton.setAnimation(0, 'jump-2', false);                 
                },0.1);
            }
        }
    }

    protected playerDie(): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPause === false){
            this.playerSkeleton.setAnimation(0, 'die', true);
            this.AudioController.onAudio(3);
            this.scheduleOnce(()=> {
                this.playerSkeleton.setAnimation(0, 'die', false);
            },0.1);
        }
    }
    
    protected onBeginContactPlayer(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null ): void {
        this.scheduleOnce (()=> {
            if(otherCollider.tag === 1){
                if(this.GameModel.IsOver === false){
                    this.playerSkeleton.setAnimation(0, 'run', true);
                    this.playerSkeleton.setAnimation(1, 'aim', true);
                }
            }
            //Player contact with coin
            if(otherCollider.tag === 2){
                otherCollider.node.active = false;
                this.ResultController.addScoreCoin();
                this.AnimationController.handleCoinCollect(otherCollider.node);
                this.AudioController.onAudio(0); //collect coin
            }
            //collide enemy1 with player
            if(otherCollider.tag === 3){
                if(this.checkCollectShield === false){
                    this.GameModel.IsOver = true;
                    this.playerDie();
                }
            }
            //collide enemy2 with player
            if(otherCollider.tag === 4){
                // this.node.getComponent(Animation).play('die');
                if(this.checkCollectShield === false){
                    this.playerDie();
                    this.GameModel.IsOver = true;
                }
            }
            //collide boom
            if(otherCollider.tag === 8){
                if(this.checkCollectShield === false){
                    this.playerDie();
                    otherCollider.node.active = false;
                    this.GameModel.IsOver = true;
                    this.nodeBoomExplosion.active = true;
                    this.scheduleOnce(()=>{
                        this.nodeBoomExplosion.getComponent(Animation).stop();
                    }, 1);
                }
            }
            //collect Item Shield
            if(otherCollider.tag === 6){
                this.checkCollectShield = true;
                otherCollider.node.active = false;
            }
            //collect Item TNT
            if(otherCollider.tag === 5){
                otherCollider.node.active = false;
                
                for(let i = 0; i < this.CoinController.PoolCoin.length; i++){
                    if(this.CoinController.PoolCoin[i].position.x >= -560 && this.CoinController.PoolCoin[i].position.x <= 580){
                        this.AnimationController.handleCoinCollect(this.CoinController.PoolCoin[i]);
                        this.CoinController.PoolCoin[i].active = false;
                        this.ResultController.addScore();
                        this.AudioController.onAudio(0);
                    }
                }
            }
            //collect Item Plane
            if(otherCollider.tag === 7){
                otherCollider.node.active = false;
                this.nodePlane.active = true;
            }
            //weapon enemy
            if(otherCollider.tag === 9){
                if(this.GameModel.IsAttack === true && this.checkCollectShield === false){
                    otherCollider.node.parent.getComponent(sp.Skeleton).timeScale = 0;
                    this.playerDie();
                    this.GameModel.IsOver = true;
                }
            }
            //bullet enemy
            if(otherCollider.tag === 12){
                if(this.checkCollectShield === false){
                    this.playerDie();
                    this.GameModel.IsOver = true;
                }
            }
        });
    }

    //Shield
    protected onBeginContactShield(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null ): void {
        this.scheduleOnce(()=> {
            //collide enemy1
            if(otherCollider.tag === 3){ 
                otherCollider.node.active = false;
                this.AnimationController.handleExplosion(otherCollider.node);
                this.AudioController.onAudio(2); //enemy die
                this.scheduleOnce(()=> {
                    this.checkCollectShield = false;
                }, 0.2)
            }
            //collide enemy2
            if(otherCollider.tag === 4){ 
                otherCollider.node.active = false;
                this.AnimationController.handleExplosion(otherCollider.node);
                this.AudioController.onAudio(2); //enemy die
                this.scheduleOnce(()=> {
                    this.checkCollectShield = false;
                }, 0.2)
            }

            //collide boom
            if(otherCollider.tag === 8){ 
                otherCollider.node.active = false;
                this.AnimationController.handleExplosionBulletPlane(otherCollider.node);
                this.AudioController.onAudio(4); //boom
                this.scheduleOnce(()=> {
                    this.checkCollectShield = false;
                }, 0.2)
            }
            if(otherCollider.tag === 9){ 
                otherCollider.node.active = false;
                this.AnimationController.handleExplosion(otherCollider.node);
                this.scheduleOnce(()=> {
                    this.checkCollectShield = false;
                }, 0.2)
            }
            //bullet enemy
            if(otherCollider.tag === 12){
                otherCollider.node.active = false;
                this.AnimationController.handleExplosionBulletPlane(otherCollider.node);
                this.scheduleOnce(()=> {
                    this.checkCollectShield = false;
                }, 0.2)
            }
        });
    }
}