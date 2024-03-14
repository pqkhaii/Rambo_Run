import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export type DataGame = {
    data: {
        highScore: number,
        tutorial: boolean,
        logGame: object
    }
}

export class DataUser {
    public static dataUser: DataGame = { 
        data:{ 
            highScore: 0,
            tutorial: true,
            logGame: {}
        } 
    }
}