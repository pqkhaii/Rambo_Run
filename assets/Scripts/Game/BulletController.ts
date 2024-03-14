import { _decorator, Collider2D, Component, Contact2DType, instantiate, Node, Prefab, RigidBody2D, sp, v3, Vec2, Vec3 } from 'cc';
import { ResultController } from './ResultController';
import { AudioController } from './AudioController';
import { AnimationController } from './AnimationController';
import { GameModel } from './GameModel';

const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: AudioController})
    private AudioController: AudioController;

    @property({type: ResultController})
    private ResultController: ResultController;

    @property({type: AnimationController})
    private AnimationController: AnimationController;

    @property({type: Node})
    private nodePlane: Node;

    @property({type: Prefab})
    private prefabBullet: Prefab;

    @property({type: Prefab})
    private prefabBulletPlane: Prefab;

    @property({type: Prefab})
    private prefabBulletEnemy: Prefab;

    @property({type: Node})
    private nodeBullet: Node;

    private poolBullet: Node[] = [];
    private poolBulletPlane: Node[] = [];
    private poolBulletEnemy: Node[] = [];

    private nextfire: number = 0;
    private firerate: number = 200;

    private getColliderBulletPlane: Collider2D;

    //----------- GET / SET -----------//
    
    //----------------------------------//
    protected update(dt: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            if(this.nodePlane.active === true){
                if(Date.now() > this.nextfire){
                    this.nextfire = Date.now() + this.firerate;
                    this.spawnBulletPlane();
                }
            }
        }
        else{
            // this.getColliderBulletPlane.off(Contact2DType.BEGIN_CONTACT, this.onBeginContactBullet, this);
            for(let i = 0; i < this.poolBulletPlane.length; i++){
                this.poolBulletPlane[i].active = false;
            }
            for(let i = 0; i < this.poolBullet.length; i++){
                this.poolBullet[i].active = false;
            }
        }
    }

    /** ------------------ spawn bullet ----------------*/
    public spawnBullet(player: Node, enemy: Node): void {
        if(this.checkStatusBullet() !== null ){
            const bulletChild = this.checkStatusBullet();
            bulletChild.active = true;
            var getPlayerPositionX = player.position.x;
            var getPlayerPositionY = player.position.y;
            bulletChild.position = v3(getPlayerPositionX + 42, getPlayerPositionY + 75);

            //move bullet
            // bulletChild.getComponent(RigidBody2D).linearVelocity = new Vec2(50, 0);
            var changePoEnemy = v3(enemy.position.x, enemy.position.y + 50, 0)
            const direction = changePoEnemy.clone().subtract(bulletChild.position);
            const velocity = direction.normalize().multiplyScalar(40); // speed
            if(velocity.y <= 0){
                velocity.y = 0;
            }

            bulletChild.getComponent(RigidBody2D).linearVelocity = new Vec2(velocity.x, velocity.y);

            //check collide
            const colliderBullet = bulletChild.getComponent(Collider2D); 
            if (colliderBullet) {
                colliderBullet.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactBullet, this);
            }

            this.AudioController.onAudio(1); //shoot
        }  
    }

    //create bullet and check
    protected checkStatusBullet(): Node {
        for(let i = 0; i < this.poolBullet.length; i++){
            if(this.poolBullet[i].active === false){
                return this.poolBullet[i];
            }
        }

        //create new bullet
        const bullet = instantiate(this.prefabBullet);
        bullet.parent =  this.nodeBullet;
        bullet.active = false;
        this.poolBullet.push(bullet);
        return bullet;
    }

    /** ------------------ spawn bullet Enemy----------------*/
    public spawnBulletEnemy(enemy: Node, player: Node): void {
        if(this.checkStatusBulletEnemy() !== null){
            const bulletChild = this.checkStatusBulletEnemy();
            bulletChild.active = true;
            var getEnemyPositionX = enemy.position.x-25;
            var getEnemyPositionY = enemy.position.y+20;
            bulletChild.position = v3(getEnemyPositionX, getEnemyPositionY);
            
            //move bullet
            var changePosPlayer = v3(player.position.x, player.position.y + 50, 0)
            const direction = changePosPlayer.clone().subtract(bulletChild.position);
            const velocity = direction.normalize().multiplyScalar(13); // speed
            bulletChild.getComponent(RigidBody2D).linearVelocity = new Vec2(velocity.x, velocity.y);

            //check collide
            const colliderBullet = bulletChild.getComponent(Collider2D); 
            if (colliderBullet) {
                colliderBullet.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactBulletEnemy, this);
            }

            this.AudioController.onAudio(1); //shoot
        }  
    }

    //create bullet and check
    protected checkStatusBulletEnemy(): Node {
        for(let i = 0; i < this.poolBulletEnemy.length; i++){
            if(this.poolBulletEnemy[i].active === false){
                return this.poolBulletEnemy[i];
            }
        }

        //create new bullet
        const bullet = instantiate(this.prefabBulletEnemy);
        bullet.parent =  this.nodeBullet;
        bullet.active = false;
        this.poolBulletEnemy.push(bullet);
        return bullet;
    }
    /** --------------------------------------------------- */

    protected onBeginContactBullet(selfCollider: Collider2D, otherCollider: Collider2D | null ): void {
        this.scheduleOnce(()=> {
            switch(otherCollider.tag){
                case 1:
                    // !active bullet plane
                    selfCollider.node.active = false;
                    this.AnimationController.handleExplosionBulletPlane(otherCollider.node);
                    break;
                case 3: //enemy 1
                    this.AnimationController.handleExplosion(otherCollider.node);
                    selfCollider.node.active = false;
                    otherCollider.node.active = false;
                    
                    this.ResultController.addScore();
                    this.AudioController.onAudio(2); //enemy die
                    break;
                case 4: //enemy 2
                    this.AnimationController.handleExplosion(otherCollider.node);
                    selfCollider.node.active = false;
                    otherCollider.node.active = false;
                    break;
                case 7:
                    // !active bullet
                    selfCollider.node.active = false;
                    break;
                case 8:
                    this.AnimationController.handleExplosion(otherCollider.node);
                    otherCollider.node.active = false;
                    break;
                case 9:
                    // otherCollider.node.active = false;
                    this.GameModel.IsAttack = false;
                    otherCollider.node.parent.getComponent(sp.Skeleton).setAnimation(0, 'walk', true);
                    this.AnimationController.handleExplosionWeaponEnemy(selfCollider.node);
                    break;
            }
        });
    }

    protected onBeginContactBulletEnemy(selfCollider: Collider2D, otherCollider: Collider2D | null ): void {
        this.scheduleOnce(()=> {
            switch(otherCollider.tag){
                case 1:
                    // !active bullet
                    selfCollider.node.active = false;
                    break;
            }
        });
    }

    //--------- Bullet for Plane-----------//
    public spawnBulletPlane(): void {
        if(this.checkStatusBulletPlane() !== null ){
            const bulletPlaneChild = this.checkStatusBulletPlane();
            bulletPlaneChild.active = true;
            var getPlayerPositionX = this.nodePlane.position.x;
            var getPlayerPositionY = this.nodePlane.position.y;
            bulletPlaneChild.position = v3(getPlayerPositionX, getPlayerPositionY, 0.0);

            //move bullet
            // bulletPlaneChild.getComponent(RigidBody2D).linearVelocity = new Vec2(50, 0);

            //check collide
            this.getColliderBulletPlane = bulletPlaneChild.getComponent(Collider2D); 
            if (this.getColliderBulletPlane) {
                this.getColliderBulletPlane.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactBullet, this);
            }
        }  
    }

    protected checkStatusBulletPlane(): Node {
        for(let i = 0; i < this.poolBulletPlane.length; i++){
            if(this.poolBulletPlane[i].active === false){
                return this.poolBulletPlane[i];
            }
        }

        //create new bullet
        const bullet = instantiate(this.prefabBulletPlane);
        bullet.parent =  this.nodeBullet;
        bullet.active = false;
        this.poolBulletPlane.push(bullet);
        return bullet;
    }
}

