import { isArray } from "lodash";
import { json } from "react-router-dom";

const token = localStorage.token;

const getIndex = (data) => {
    let final = data.map((item,index)=>{
        return {...item, index:index+1}
    });
    final = getId(final);
    return final
}
const getId = (data) => {
    const final = data.map(item=>{
        return {...item, id:item._id.slice(17)}
    })
    return final
}
const myFetch = async(url) => {

    const myIpResponse = await fetch('https://api.ipify.org/?format=json');
    const myIp = await myIpResponse.json();

    console.log(myIp.ip);

    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'IpAddress': myIp.ip
    },   
    })
    let data = await response.json();

    if(response.status!==404){
        if(isArray(data)){
            data = getIndex(data);
            data = getId(data);
        }
        return data;
    }else{
        return 404
    }
}

export const allClientsInternal = async() => {
    const url = 'http://localhost:5000/api/clientInternal';
    const data = await myFetch(url)
    return (data);
}
export const allClientsExternal = async() => {
    const url = 'http://localhost:5000/api/clientExternal';
    const data = await myFetch(url)
    return (data);
}

export const allEmployees = async () => {
    const url = 'http://localhost:5000/api/employee';
    const data = await myFetch(url)
    return (data);
}

export const clientInternalById = async (id) => {
    const url = `http://localhost:5000/api/clientInternal/${id}`;
    return (myFetch(url));
}
export const clientExternalById = async (id) => {
    const url = `http://localhost:5000/api/clientExternal/${id}`;
    return (myFetch(url));    
}
export const employeeById = async (id) => {
    const url = `http://localhost:5000/api/employee/${id}`;
    return (myFetch(url));
}
export const allMaterials = async (id) => {
    const url = 'http://localhost:5000/api/material';
    return (myFetch(url));

}
export const materialsById = async (id) => {
    const url = `http://localhost:5000/api/material/${id}`;
    return (myFetch(url));
}

export const allJobs = async (id) => {
    const url = 'http://localhost:5000/api/job';
    return (myFetch(url));
}
export const JobById = async (id) => {
    const url = `http://localhost:5000/api/job/${id}`;
    return (myFetch(url));
}

export const orderInternalList = async (id) => {
    const url = `http://localhost:5000/api/orderInternal/list`;
    return (myFetch(url));
}
export const orderExternalList = async (id) => {
    const url = `http://localhost:5000/api/orderExternal/list`;
    return (myFetch(url));
}

export const allOrderMaterial = async() => {
    const url = 'http://localhost:5000/api/material/order';
    return (myFetch(url));
}

export const orderInternalById = async(id) => {
    const url = `http://localhost:5000/api/orderInternal/detail/${id}`;
    let response = await myFetch(url);
    if(response.length!==0){
        response = [{...response[0], details:getIndex([...response[0].details])}]
    }
    return (response);
}

export const orderExternalById = async(id) => {
    const url = `http://localhost:5000/api/orderExternal/detail/${id}`;
    let response = await myFetch(url);
    if(response.length!==0){
        response = [{...response[0], details:getIndex([...response[0].details])}]
    }
    return (response);
}

export const getConfigBackup = async() => {
    const url = 'http://localhost:5000/api/configBackup';
    let response = await myFetch(url);
    return (response);
}

export const getBackupFiles = async () => {
    const url = 'http://localhost:5000/api/configBackup/list';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let data = await response.json();
    let final = data.map((item,index)=>{
        return {...item, id:index+1, date: item.createAt.slice(0,10), time: item.createAt.slice(11,19)}
    });
    return (final); 
}

export const getOrderNoConfirmed = async () => {
    const url = 'http://localhost:5000/api/orders/noConfirm';
    let response = await myFetch(url);
    return (response);
}

export const getOrderDetailsConfirmed = async () => {
    const url = 'http://localhost:5000/api/orderDetails';
    let response = await myFetch(url);
    return (response);
}

export const getSchedule = async () => {
    const url = 'http://localhost:5000/api/schedule/generate';
    let response = await myFetch(url);
    return (response);
}

export const getStepById = async (id) => {
    const url = `http://localhost:5000/api/step/next/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getOrderById = async (id) => {
    const url = `http://localhost:5000/api/orders/finish/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getMaterialStractByid = async (id) => {
    const url = `http://localhost:5000/api/material/extract/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let data = await response.json();
    let final = data.map((item,index)=>{
        return {...item, id:index+1}
    });
    return (final);
}

export const getOrdersDelayed = async () => {
    const url = 'http://localhost:5000/api/orderDetails/delayed';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let data = await response.json();
    return data
}