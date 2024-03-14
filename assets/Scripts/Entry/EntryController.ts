import { _decorator, Button, Color, Component, director, find, Label, Node, Sprite, sys } from 'cc';
import { Constants } from '../Game/Constants';
import { AudioEntryController } from './AudioEntryController';
import { StoreAPI } from '../Loading/StoreAPI';
import { DataUser } from '../Loading/DataUser';
const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {
    @property({type: AudioEntryController})
    private AudioEntryController: AudioEntryController;

    @property({type: Button})
    private btnOnAudio: Button;

    @property({type: Button})
    private btnOffAudio: Button;

    @property({type: Button})
    private btnPlay: Button;

    @property({type: Node})
    private loading: Node;

    protected start(): void {
        director.resume();
        this.HandleAudio();
        this.handleTutorial();
        this.loading.active = false;
    }

    protected handleTutorial(): void {
        if(DataUser.dataUser.data.tutorial === true || DataUser.dataUser.data.tutorial === undefined){
            Constants.newGame = true;
        }
        else{
            Constants.newGame = false;
        }
    }

    protected HandleAudio(): void {
        if(Constants.volume === true){
            this.AudioEntryController.AudioSource.play();
            this.AudioEntryController.settingAudio(1);
            this.btnOffAudio.node.active = false;
            this.btnOnAudio.node.active = true;
        }
        else{
            this.AudioEntryController.AudioSource.stop();
            this.AudioEntryController.settingAudio(0);
            this.btnOffAudio.node.active = true;
            this.btnOnAudio.node.active = false;
        }
    }

    protected onTouchOnAudio(): void {
        Constants.volume = true;

        this.AudioEntryController.settingAudio(1);
        this.AudioEntryController.AudioSource.play();

        this.btnOffAudio.node.active = false;
        this.btnOnAudio.node.active = true;
    }

    protected onTouchOffAudio(): void {
        Constants.volume = false;

        this.AudioEntryController.AudioSource.stop();
        this.AudioEntryController.settingAudio(0);

        this.btnOffAudio.node.active = true;
        this.btnOnAudio.node.active = false;
    }

    protected async onTouchPlay(): Promise<void> {
        this.btnPlay.interactable = false;
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);

        this.loading.active = true;
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        director.loadScene(Constants.sceneGame);
    }
}