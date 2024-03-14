import { _decorator, Component, director, Node } from 'cc';
import { ResultController } from './ResultController';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({type: ResultController})
    private ResultController: ResultController;

    @property({type: Node})
    private showResult: Node;

    @property({type: Node})
    private nodeTutorial: Node;

    @property({type: Node})
    private nodeTutorialInGame: Node;

    @property({type: Node})
    private loading: Node;

    protected start(): void {
        this.handleLoading(false);
        this.showResult.active = false;
        this.handleTutorialInGame(false);
        if(Constants.newGame === true){
            this.handleTutorial(true);
        }
        else{
            this.handleTutorial(false);
        }
    }

    public showGameOVer(): void{
        this.ResultController.showResults();
        this.showResult.active = true;
    }

    public handleTutorial(status: boolean) : void {
        if(status === true){
            this.nodeTutorial.active = true;
        }
        else{
            this.nodeTutorial.active = false;
        }
    }

    public handleTutorialInGame(status: boolean) : void {
        if(status === true){
            this.nodeTutorialInGame.active = true;
        }
        else{
            this.nodeTutorialInGame.active = false;
        }
    }

    public handleLoading(status: boolean) : void {
        if(status === true){
            this.loading.active = true;
        }
        else{
            this.loading.active = false;
        }
    }
}


