import axios, { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-root-toast";

export type tasksDict = {
    vak: string,
    title: string,
    type: string,
    comment: string,
    deadline: Date
}

export type pointsDict = {
    vak: string,
    title: string,
    comment: string,
    scoreFloat: number,
    scoreTotal: number,
    dw: string,
    date: Date,
    type: string
}

export type agendaDict = {
    vak: String,
    room: String,
    title: String,
    comment: String,
    date: Date,
    period: number
}

export class Schoolware {
    username: string;
    password: string;
    token: string;
    domain: string;
    server: URL
    microsoft: boolean;
    valid: boolean

    constructor(username: string, password: string, domain: string, server: URL = new URL("http://192.168.0.111:3000"), valid = false, accountType: string) {
        this.username = username;
        this.password = password;
        this.token = "";
        this.domain = domain;
        this.server = server;
        this.valid = valid
        this.microsoft = accountType == "microsoft" ? true : false
    }

    async login() {
        let response = await axios({
            method: "post",
            url: this.microsoft ? this.server.toString() + "token/microsoft" : this.server.toString() + "token/schoolware",
            data: {
                username: this.username,
                password: this.password
            }
        });
        this.token = response.data.token;
        AsyncStorage.setItem('token', this.token);
        let success = response.data.success;
        if (!success) {
            console.log(response);
            /*let toast = Toast.show('Bad login info, check username and password', {
                duration: Toast.durations.LONG,
              });*/
            this.valid = false;
        } else {
            this.valid = true;
        }

    }

    private async makeRequest(path: string) {
        try{
            const token = await AsyncStorage.getItem('token');
            if(token != null){
                this.token = token;
            } else {
                console.log("no saved token");
            }
        } catch(e){
        }
        let response = await axios({
            method: "post",
            url: `${this.server.toString()}${path}`,
            data: { "token": this.token }
        })
        return response.data;
    }

    async checkToken(): Promise<boolean> {
        let response = await this.makeRequest("main/check");
        console.log(response.succes)
        return response.succes
    }

    async checkAndRequest(path: string) {
        console.log("checking token")
        const succes: boolean = await this.checkToken()
        if (succes) {
            console.log("token valid")
            return await this.makeRequest(path);
        } else {
            console.log("needs to relogin");
            await this.login();
            return await this.makeRequest(path);
        }

    }

    async getPunten(): Promise<pointsDict[]> {
        return await this.checkAndRequest("main/points");
    }
    async getTasks(): Promise<tasksDict[]> {
        return await this.checkAndRequest("main/tasks");
    }
    async getAgenda(): Promise<agendaDict[]> {
        return await this.checkAndRequest("main/agenda");
    }
}

var schoolware = new Schoolware("", "", "", undefined, false, "");

(async () => {
    getSchoolware();
})();

export async function getSchoolware() {
    try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const domain = await AsyncStorage.getItem('domain');
        const accountType = await AsyncStorage.getItem('accountType');
        if (username !== null && password !== null && domain !== null) {
            var savedUsername = username
            var savedPassword = password
            var savedDomain = domain

            schoolware = new Schoolware(savedUsername, savedPassword, savedDomain, undefined, true, accountType);
        }
        else {
            console.log("no saved login info")
        }
    } catch (e) {
        console.log(e)
    }
    return schoolware
}

