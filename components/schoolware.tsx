import axios, { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultBackend  from "../constants/env"


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

    constructor(username: string, password: string, domain: string, server: URL, valid = false, accountType: string) {
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
                password: this.password,
                domain: this.domain
            }
        });
        this.token = response.data.token;
        let success = response.data.success;
        if (!success) {
            console.log(response);
            /*let toast = Toast.show('Bad login info, check username and password', {
                duration: Toast.durations.LONG,
              });*/
            this.valid = false;
        } else {
            this.valid = true;
            console.log("setting token in storage");
            AsyncStorage.setItem('token', this.token);
        }

    }

    
    private async makeRequest(path: string, data: object = {}) {
        try{
            const token = await AsyncStorage.getItem('token');
            if(token != null){
                this.token = token;
            } else {
                console.log("no saved token");
            }
        } catch(e){
            console.log(e);
        }
        const fixedData = { "token": this.token }
        let response = await axios({
            method: "post",
            url: `${this.server.toString()}${path}`,
            data: {...fixedData,...data}//
            
        })
        return response.data;
    }

    async checkToken(): Promise<boolean> {
        let response = await this.makeRequest("main/check");
        console.log(response.succes)
        return response.succes
    }

    async checkAndRequest(path: string, data: object = {}) {
        console.log("checking token")
        const succes: boolean = await this.checkToken()
        if (succes) {
            console.log("token valid")
            return await this.makeRequest(path, data);
        } else {
            console.log("needs to relogin");
            await this.login();
            return await this.makeRequest(path, data);
        }

    }

    async getPunten(): Promise<pointsDict[]> {
        return await this.checkAndRequest("main/points");
    }
    async getTasks(): Promise<tasksDict[]> {
        return await this.checkAndRequest("main/tasks");
    }
    async getAgenda(date: Date = new Date()): Promise<agendaDict[]> {
        return await this.checkAndRequest("main/agenda", {"date": date});
    }
}



export async function getSchoolware() {
    try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const domain = await AsyncStorage.getItem('domain');
        const accountType = await AsyncStorage.getItem('accountType');
        const backend = await AsyncStorage.getItem('backend');
        if (username !== null && password !== null && domain !== null && accountType != null) {
            var savedUsername = username
            var savedPassword = password
            var savedDomain = domain
            if(backend == null){
                var savedBackend = defaultBackend
            } else {
                var savedBackend = backend;
            }

            return await new Schoolware(savedUsername, savedPassword, savedDomain, new URL(savedBackend), true, accountType);
        }
        else {
            console.log("no saved login info")
            return await new Schoolware("", "", "", new URL(defaultBackend), false, "");
        }
    } catch (e) {
        console.log(e)
        return await new Schoolware("", "", "", new URL(defaultBackend), false, "");
    }
}

