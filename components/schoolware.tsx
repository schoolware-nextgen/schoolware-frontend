import axios, { AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultBackend  from "../constants/env"
import Toast from 'react-native-toast-message';

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

    async login(): Promise<[boolean, number]> {
        let response = await axios({
            method: "post",
            url: this.microsoft ? this.server.toString() + "token/microsoft" : this.server.toString() + "token/schoolware",
            data: {
                username: this.username,
                password: this.password,
                domain: this.domain
            }
        });
        
        let success = response.data.success;
        if (!success) {
            console.log(response);
            Toast.show({
                type: 'error',
                text1: 'error during login status: ' + response.data.status,
              });
            
            this.valid = false;
            return [false, response.data.status]
        } else {
            this.token = response.data.token;
            this.valid = true;
            console.log("setting token in storage");
            await AsyncStorage.setItem('token', this.token);
            return [true, response.data.status]
        }

    }

    
    private async makeRequest(path: string, data: object = {}){
        try{
            const token = await AsyncStorage.getItem('token');
            if(token != null){
                console.log("found token");
                this.token = token;
            } else {
                console.log("no saved token");
            }
        } catch(e){
            console.log(e);
        }
        const fixedData = { "token": this.token, "domain": this.domain }
        let response = await axios({
            method: "post",
            url: `${this.server.toString()}${path}`,
            data: {...fixedData,...data}//
            
        })
        return [response.data, response.data.success, response.data.status];
    }

    async checkToken(): Promise<boolean> {
        const fixedData = { "token": this.token, "domain": this.domain }
        let response = await axios({
            method: "post",
            url: `${this.server.toString()}main/check`,
            data: {...fixedData}//
            
        })
        console.log(response.data)
        return response.data.success;
    }


    async checkAndRequest(path: string, data: object = {}){
        console.log("making request")
        //flow
        //request
        //check success
        //if success return data
        //if not success try relogin and run request again
        //if success return data

        //try normal request
        let [response, success, status] = await this.makeRequest(path, data);
        if(success){
            //success return data
            return [response, true];
        } else if (status == 401){
            //401 relogin
            let [success,status] = await this.login();
            //if success return data
            if(success){
                let [response, success, status] = await this.makeRequest(path, data);
                return [response, status]
            } else {
                return [response, false]
            }
        } else {
            //unknown error return empty array
            console.log("ERROR request: " + path + " error: "+ status)
            Toast.show({
                type: 'error',
                text1: 'error getting data status: ' + status,
              });
            return [response, false]
        }
        return [response, false];

    }

    async getPunten(): Promise<pointsDict[]> {
        let [response, success] = await this.checkAndRequest("main/points");
        return response.data;
    }
    async getTasks(): Promise<tasksDict[]> {
        let [response, success] = await this.checkAndRequest("main/tasks");
        return response.data;
    }
    async getAgenda(date: Date = new Date()): Promise<agendaDict[]> {
        let [response, success] = await this.checkAndRequest("main/agenda", {"date": date});
        return response.data;
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

