import { _decorator, Collider2D, Component, instantiate, Node, Prefab, randomRangeInt, sp, Vec3, Animation, randomRange } from 'cc';
import { GameModel } from './GameModel';
import { Constants } from './Constants';
import { BulletController } from './BulletController';
import { ResultController } from './ResultController';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: BulletController})
    private BulletController: BulletController;

    @property({type: ResultController})
    private ResultController: ResultController;
   
    @property({type: Node})
    private nodeEnemy: Node;

    @property({type: Prefab})
    private prefabEnemy: Prefab;

    @property({type: Prefab})
    private prefabEnemy2: Prefab;

    @property({type: Prefab})
    private prefabEnemy3: Prefab;

    @property({type: Prefab})
    private prefabEnemy4: Prefab;

    @property({type: Prefab})
    private prefabBoom: Prefab;

    @property({type: Node})
    private posPlayer: Node;

    private nodeBoom: Node;

    private poolEnemy: Node[] = [];
    private poolEnemy2: Node[] = [];
    private poolEnemy3: Node[] = [];
    private poolEnemy4: Node[] = [];

    private poolEnemies: Node[] = [];

    private countEnemyTrue: number = 0;
    private hasCountEnemy: boolean = false;
    private hasCountEnemy2: boolean = false;
    private hasCountEnemy3: boolean = false;
    private hasCountEnemy4: boolean = false;

    //ramdom attack
    private nextfire: number = 0;
    private firerate: number = 400;

    private countEnemy3: number = 1;

    //get - set
    public get PoolEnemies() : Node[] {
        return this.poolEnemies;
    }
    
    public set PoolEnemies(v : Node[]) {
        this.poolEnemies = v;
    }

    protected start(): void {
        this.createEnemy(this.prefabEnemy, this.nodeEnemy, Constants.numOfEnemy1, this.poolEnemy);
        this.createEnemy(this.prefabEnemy2, this.nodeEnemy,  Constants.numOfEnemy2, this.poolEnemy2);
        this.createEnemy(this.prefabEnemy3, this.nodeEnemy,  Constants.numOfEnemy3, this.poolEnemy3);
        this.createEnemy(this.prefabEnemy4, this.nodeEnemy,  Constants.numOfEnemy4, this.poolEnemy4);
        this.createBoom();
    }

    protected update(deltaTime: number): void {
        if(this.GameModel.IsStopUpdate === false && this.GameModel.IsPlay === true){
            //enemy
            if(this.checkPoolEnemyActive(this.poolEnemy) === false && this.hasCountEnemy === false){
                this.countEnemyTrue += 1;
                this.hasCountEnemy = true;
            }
            else{
                this.moveEnemy(deltaTime);  
            }

            //enemy2
            if(this.checkPoolEnemyActive(this.poolEnemy2) === false && this.hasCountEnemy2 === false){
                this.countEnemyTrue += 1;
                this.hasCountEnemy2 = true;
            }
            else{
                this.moveEnemy2(deltaTime);  
            }

            //enemy3
            if(this.checkPoolEnemyActive(this.poolEnemy3) === false){ //&& this.hasCountEnemy3 === false
                // this.countEnemyTrue += 1;
                // this.hasCountEnemy3 = true;
                this.setTrueEnemy3();
            }
            else{
                this.moveEnemy3(deltaTime);  
            }

            //enemy4
            if(this.checkPoolEnemyActive(this.poolEnemy4) === false && this.hasCountEnemy4 === false){
                this.countEnemyTrue += 1;
                this.hasCountEnemy4 = true;
            }
            else{
                this.moveEnemy4(deltaTime);  
            }

            //boom
            this.moveBoom(deltaTime);

            if(this.countEnemyTrue >= 3){
                var random = randomRangeInt(0,3);
                switch(random){
                case 0:
                    this.setTrueEnemy();
                    this.countEnemyTrue -= 1;
                    this.hasCountEnemy = false;
                    break;
                case 1:
                    this.setTrueEnemy2();
                    this.countEnemyTrue -= 1;
                    this.hasCountEnemy2 = false;
                    break;
                case 2:
                    this.setTrueEnemy4();
                    this.countEnemyTrue -= 1;
                    this.hasCountEnemy4 = false;
                    break;
                }
            }
        }
    }

    protected createEnemy(prefabEnemy: Prefab, nodeEnemy: Node, numberEnemy: number, poolEnemy: Node[]): void {
        for(let i = 0; i < numberEnemy; i++){
            const enemy = instantiate(prefabEnemy);
            enemy.parent = nodeEnemy;
            enemy.active = false;
            poolEnemy.push(enemy);
            this.poolEnemies.push(enemy);

            let randomEnemy = randomRangeInt(850, 1000)

            enemy.setPosition(randomEnemy, -270, 0.0); //y : -202
            enemy.getComponent(Collider2D).apply();
        }
    }

    protected checkStatus(enemy: Node): Node {
        if(enemy.active === false){
            return enemy;
        }
        return null;
    }

    //Enemy 1
    protected moveEnemy(number: number): void {
        for(let i = 0; i < Constants.numOfEnemy1; i++){
            const enemy = this.poolEnemy[i];

            if (!enemy.active) {
                continue;
            }

            var posX = enemy.getPosition().x;
            var posY = enemy.getPosition().y;

            if(posX <= -750){
                enemy.active = false;
            }
            else{
                posX -= this.GameModel.SpeedOfEnemy * number;            
            }

            //enemy attack
            if(i === 3 && posX >= 450 && posX <= 480){ //&& this.GameModel.IsAttack === false
                enemy.getComponent(sp.Skeleton).setAnimation(0, 'attack', true);
                enemy.getComponent(sp.Skeleton).timeScale = 0.4;
                this.GameModel.IsAttack = true;
                enemy.children[0].active = true;
                this.scheduleOnce(() => {
                    enemy.getComponent(sp.Skeleton).setAnimation(0, 'walk', true);
                    enemy.getComponent(sp.Skeleton).timeScale = 1
                    this.GameModel.IsAttack = false;
                }, 2);
            }

            enemy.setPosition(posX, posY, 0.0)
            enemy.getComponent(Collider2D).apply();
        }
    }

    protected setTrueEnemy(): void {
        // this.randomToEnemyAttack = randomRangeInt(2, Constants.numOfEnemy1);
        for(let i = 0; i < this.poolEnemy.length; i++){
            var randomEnemyX = randomRangeInt(100, 200);
            const enemyChild = this.poolEnemy[i];
            enemyChild.active = true;
            enemyChild.position = new Vec3(800 + (i * randomEnemyX), -270, 0.0);
            enemyChild.getComponent(Collider2D).apply();
        }
    }

    //Enemy 2
    protected moveEnemy2(number: number): void {
        for(let i = 0; i < Constants.numOfEnemy2; i++){
            const enemy = this.poolEnemy2[i];

            if (!enemy.active) {
                continue;
            }

            var posX = enemy.getPosition().x;
            var posY = enemy.getPosition().y;

            posX -= this.GameModel.SpeedOfEnemy * number;

            if(posX <= -750){
                enemy.active = false;
            }

            //enemy attack
            if(i === 2 && posX >= 450 && posX <= 480){ //&& this.GameModel.IsAttack === false
                enemy.getComponent(sp.Skeleton).setAnimation(0, 'attack', true);
                enemy.getComponent(sp.Skeleton).timeScale = 0.4;
                this.GameModel.IsAttack = true;
                enemy.children[0].active = true;
                this.scheduleOnce(() => {
                    enemy.getComponent(sp.Skeleton).setAnimation(0, 'walk', true);
                    enemy.getComponent(sp.Skeleton).timeScale = 1
                    this.GameModel.IsAttack = false;
                }, 2); //1.5
            }

            enemy.setPosition(posX, posY, 0.0)
            enemy.getComponent(Collider2D).apply();
        }
    }

    protected setTrueEnemy2(): void {
        // this.randomToEnemy2Attack = randomRangeInt(2, Constants.numOfEnemy2);
        for(let i = 0; i < this.poolEnemy2.length; i++){
            var randomEnemyX = randomRangeInt(100, 150);
            const enemyChild = this.poolEnemy2[i];
            enemyChild.active = true;
            enemyChild.children[0].active = false;
            enemyChild.position = new Vec3(800 + (i * randomEnemyX), -270, 0.0);
            enemyChild.getComponent(Collider2D).apply();
        }
    }

    //Enemy 3
    protected moveEnemy3(number: number): void {
        for(let i = 0; i < this.poolEnemy3.length; i++){
            const enemy = this.poolEnemy3[i];

            if (!enemy.active) {
                continue;
            }

            var posX = enemy.getPosition().x;
            var posY = enemy.getPosition().y;

            if(posX <= -750){
                posX = 1200;
                enemy.active = false;
            }
            else{
                posX -= this.GameModel.SpeedOfEnemy * number;
            }

            //enemy attack
            if(posX >= 500 && posX <= 550 && enemy.active === true){
                var enemySkeleton = enemy.getComponent(sp.Skeleton);
                
                enemySkeleton.timeScale = 1.5;
                enemySkeleton.setAnimation(0, 'attack', true);
                enemySkeleton.setCompleteListener((trackEntry) => {
                if (trackEntry.animation.name === 'attack') {
                    enemySkeleton.timeScale = 1;
                    enemySkeleton.setAnimation(0, 'fly', true);
                    // if (Date.now() > this.nextfire) {
                    //     this.nextfire = Date.now() + this.firerate;
                        this.BulletController.spawnBulletEnemy(enemy, this.posPlayer);
                    // }
                    enemySkeleton.setCompleteListener(null);
                }
            });             
         
            }

            enemy.setPosition(posX, posY, 0.0)
            enemy.getComponent(Collider2D).apply();
        }
    }

    protected setTrueEnemy3(): void {
        var score = this.ResultController.CurrentScore;
        if(score <= 1000){
            this.countEnemy3 = 1;
        }
        else if(score > 1000 && score <= 2200){
            this.countEnemy3 = 2;
        }
        else{
            this.countEnemy3 = 3;
        }
        this.scheduleOnce(() => {
            for(let i = 0; i < this.countEnemy3; i++){
                var randomEnemyX = randomRangeInt(400, 600);
                const enemyChild = this.poolEnemy3[i];
                enemyChild.active = true;
                var posY = randomRange(-160, 0);
                enemyChild.position = new Vec3(900 + (i * randomEnemyX), posY, 0.0);
                enemyChild.getComponent(Collider2D).apply();
            }
        }, 2);
    }

    //Enemy 4
    protected moveEnemy4(number: number): void {
        for(let i = 0; i < Constants.numOfEnemy4; i++){
            const enemy = this.poolEnemy4[i];

            if (!enemy.active) {
                continue;
            }

            var posX = enemy.getPosition().x;
            var posY = enemy.getPosition().y;

            posX -= (this.GameModel.SpeedOfEnemy + 100) * number;

            if(posX <= -750){
                enemy.active = false;
            }
            enemy.setPosition(posX, posY, 0.0)
            enemy.getComponent(Collider2D).apply();
        }
    }

    protected setTrueEnemy4(): void {
        for(let i = 0; i < this.poolEnemy4.length; i++){
            var randomEnemyX = randomRangeInt(100, 250);
            const enemyChild = this.poolEnemy4[i];
            enemyChild.active = true;
            enemyChild.position = new Vec3(800 + (i * randomEnemyX), -225, 0.0);
            enemyChild.getComponent(Collider2D).apply();
        }
    }

    //BOOM
    protected createBoom(): void{
        this.nodeBoom = instantiate(this.prefabBoom);
        this.nodeBoom.parent = this.nodeEnemy;
        this.nodeBoom.setPosition(1000, -250, 0.0);
        this.nodeBoom.getComponent(Collider2D).apply();
    }

    protected moveBoom(number: number): void {
        if(this.checkStatus(this.nodeBoom) !== null){
            const boom = this.checkStatus(this.nodeBoom);
            boom.active = true;
            boom.position = new Vec3(1200, -250, 0.0);
            boom.getComponent(Collider2D).apply();
        }

        var posX = this.nodeBoom.getPosition().x;
        var posY = this.nodeBoom.getPosition().y;

        if(posX <= -750){
            posX = 1200;
        }
        else{
            posX -= this.GameModel.SpeedGround * number;
        }

        this.nodeBoom.setPosition(posX, posY, 0.0)
        this.nodeBoom.getComponent(Collider2D).apply();
    }

    /**Check active enemy in poolEnemy */
    protected checkPoolEnemyActive(pool: Node[]): boolean {
        var count = 0;
        for(const enemy of pool){
            if(enemy.active === false){
                count += 1;
            }
        }

        if(count === pool.length){
            return false;
        }
        else{
            return true;
        }
    }

    // public enemyGameOver(): void {
    //     for(let i = 0; i < this.poolEnemies.length; i++){
    //         const enemy = this.poolEnemies[i];
    //         const animaSkeleton = enemy.getComponent(sp.Skeleton);
    //         if(animaSkeleton){
    //             animaSkeleton.timeScale = 0;
    //         }
    //         else{
    //             enemy.getComponent(Animation).stop();
    //         }
    //     }
    // }
}