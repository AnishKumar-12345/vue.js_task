import {defineStore} from 'pinia';
import axios from 'axios';

export const useTaskstore = defineStore('tasks',{
    state:()=>({
        tasks:[],
    }),
    actions:{
        getTaskdetails(){
            return axios.get('https://628ddf5ba339dfef87a227d9.mockapi.io/api/users').then(response =>{
                this.tasks = response.data;
            }).catch(error =>{
                console.log("error to get data",error);
            });
        },
        editTaskdetails(reqid,reqdata){
            return axios.put(`https://628ddf5ba339dfef87a227d9.mockapi.io/api/users/${reqid}`,reqdata).then(response =>{
                this.tasks.push(response.data);
            }).catch(error =>{
                console.log("error to get data",error);
            });
        },
        addTaskdetails(reqdata){
            return axios.post(`https://628ddf5ba339dfef87a227d9.mockapi.io/api/users`,reqdata).then(response =>{
                this.tasks.push(response.data);
            }).catch(error =>{
                console.log("error to get data",error);
            });
        },
    },
    persist:{
        enabled: true,
    }
})
