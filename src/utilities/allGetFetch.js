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

    ///const myIpResponse = await fetch('https://api.ipify.org/?format=json');
    ///const myIp = await myIpResponse.json();

    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },   
    })
    if(response.status!==204){
        let data = await response.json();
        if(isArray(data)){
            data = getIndex(data);
            data = getId(data);
        }
        return data;
    }else{
        return 204
    }
}

export const allClientsInternal = async() => {
    const url = 'http://localhost:5000/api/clientInternal';
    const data = await myFetch(url)
    return (data);
}

export const allClientsInternalActive = async() => {
    const url = 'http://localhost:5000/api/clientInternal/active';
    const data = await myFetch(url)
    return (data);
}

export const allClientsExternal = async() => {
    const url = 'http://localhost:5000/api/clientExternal';
    const data = await myFetch(url)
    return (data);
}

export const allClientsExternalActive = async() => {
    const url = 'http://localhost:5000/api/clientExternal/active';
    const data = await myFetch(url)
    return (data);
}

export const allEmployees = async () => {
    const url = 'http://localhost:5000/api/employee';
    const data = await myFetch(url)
    return (data);
}

export const clientById = async (id) => {
    const url = `http://localhost:5000/api/clients/${id}`;
    return (myFetch(url));
}

export const getEmpInstById = async (id) => {
    const url = `http://localhost:5000/api/clients/empInst/${id}`;
    return (myFetch(url));
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

export const allJobsActive = async (id) => {
    const url = 'http://localhost:5000/api/job/active';
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
export const getOrderMaterialById = async(id) => {
    const url = `http://localhost:5000/api/material/order/${id}`;
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

    if(response.status!==204){
        let data = await response.json();
        let final = data.map((item,index)=>{
            return {...item, id:index+1, date: item.createAt.slice(0,10), time: item.createAt.slice(11,19)}
        });
        return (final); 
    }else{
        return(204);
    }

    
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

export const getOrderById = async (id) => {
    const url = `http://localhost:5000/api/orders/internalExternal/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },   
    })
    if(response.status!==204){
        let data = await response.json();
        let details = getIndex(data.details);
        details = getId(details);
        data = {...data, details:details};
        return data;
    }else{
        return 204
    }
    return (response);
} 

export const getOrderFinishedById = async (id) => {
    const url = `http://localhost:5000/api/orders/finish/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getMaterialStractByid = async (id,start,end) => {
    const url = `http://localhost:5000/api/material/extract/${id}${(start&&end)?`?start=${start}&end=${end}`:''}`;
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

export const getAllEquipment = async () => {
    const url = 'http://localhost:5000/api/equipment';
    let response = await myFetch(url);
    return (response);
}

export const getEquipmentById = async (id) => {
    const url = `http://localhost:5000/api/equipment/detail/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getReportArea = async (area, start, end) => {
    const url = `http://localhost:5000/api/reports/area/${area}?start=${start}&end=${end}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
    }
    )
    let data = await response.json();
    data = getIndex(data);
    data = getId(data);
    return data
}

export const getAllOrdersFinished = async () => {
    const url = 'http://localhost:5000/api/orders/allFinished';
    let response = await myFetch(url);
    return (response);
}

export const getOrdersFinishedReport = async (start, end) => {
    const url = `http://localhost:5000/api/reports/orders/total?start=${start}&end=${end}`;
    let response = await myFetch(url);
    return (response);
}

export const getAllBinnacle = async (user,start='',end='') => {
    let url=''
    if(user==='Todos'){
        url = `http://localhost:5000/api/binnacle?start=${start}&end=${end}`;
    }
    else
        url = `http://localhost:5000/api/binnacle?user=${user}&start=${start}&end=${end}`;
    let response = await myFetch(url);
    return (response);
}

export const getBinnacleById = async (id) => {
    const url = `http://localhost:5000/api/binnacle/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getAllUsers = async () => {
    const url = 'http://localhost:5000/api/users';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
    })
    if(response.status !== 204){
        let data = await response.json();
        return (data);
    }else
        return (204);
    
}

export const getAllUsersComplete = async() => {
    const url = 'http://localhost:5000/api/users/complete';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },   
    })
    if(response.status!==204){
        let data = await response.json();
        data = {
            institution: getId(getIndex(data.institution)),
            employee: getId(getIndex(data.employee))
        }
        return data;
    }else{
        return 204
    }
}

export const getUserById = async (id) => {
    const url = `http://localhost:5000/api/users/${id}`;
    let response = await myFetch(url);
    return (response);
}

export const getAllOrdersList = async () => {

    const formater = (data) => {
        data = getIndex(data);
        data = getId(data);
        return data
    }

    const url = 'http://localhost:5000/api/orders/allList';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },   
    })
    if(response.status!==204){
        let data = await response.json();
        data={
            internal : formater(data.internal),
            external : formater(data.external)
        }
        return data;
    }else{
        return 204
    }
}

export const getAllOrdersListById = async () => {

    const url = 'http://localhost:5000/api/orders/allListById';
    const response = await myFetch(url);
    return (response);
}

export const getQRCode = async() => {
    const url = 'http://localhost:5000/api/whatsapp/qr';
    let response = await myFetch(url);
    return (response);
}

export const getAuthenticated = async () => {
    const url = 'http://localhost:5000/api/whatsapp/status';
    let response = await myFetch(url);
    return (response);
}

export const getIsReady = async () => {
    const url = 'http://localhost:5000/api/whatsapp/ready';
    let response = await myFetch(url);
    return (response);
}

export const getQRCodeAuto = async() => {
    const url = 'http://localhost:5000/api/whatsapp/qrAuto';
    let response = await myFetch(url);
    return (response);
}

export const getStatusEmail = async() => {
    const url = 'http://localhost:5000/api/email/status';
    let response = await myFetch(url);
    return (response);
}