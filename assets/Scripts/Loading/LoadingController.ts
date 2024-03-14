import { _decorator, Component, director, find, Node } from 'cc';
import { Constants } from '../Game/Constants';
import GameClient from '@onechaintech/gamesdk';
import { DataUser } from './DataUser';
import { StoreAPI } from './StoreAPI';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
    public gameClient;
    
    public async start() : Promise<void> {
        // let _this = this;
        let parameters = find("GameClient");
        
        if (parameters === null) {
            let parameters = new Node("GameClient");
            if (this.gameClient === undefined) {
                this.gameClient = new GameClient("64ffc88f33f6e81c4375199c", "871a7a4d-8295-4d15-954c-a70ac37b7592", window.parent, {dev: true});
                await this.gameClient.initAsync()
                .then( async (data) => {
                    //Get current user id
                    let userID = this.gameClient.user.citizen.getCitizenId();

                    //Get gamedata from server
                    await this.gameClient.user.data.getGameData().then((response) => {
                        //Save data
                        if (response.data[`${userID}`] !== undefined){
                            DataUser.dataUser = response.data[`${userID}`];
                        }    
                    })
                    .catch(async (e) => {
                        console.log('Error at get game data: ', e);
                    })
                    let gameClientParams = parameters.addComponent(StoreAPI);
                    gameClientParams.gameClient = this.gameClient;
                    director.addPersistRootNode(parameters);

                    director.loadScene(Constants.sceneEntry);
                })
                .catch((err) => console.log(err));
            }
        }
    }

}
