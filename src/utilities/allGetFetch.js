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

export const allClientsInternal = async() => {
    const url = 'http://localhost:5000/api/clientInternal';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let dataClient = await response.json();
    
    return (getIndex(dataClient));
}
export const allClientsExternal = async() => {
    const url = 'http://localhost:5000/api/clientExternal';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let dataClient = await response.json();
    
    return (getIndex(dataClient));
}

export const allEmployees = async () => {
    const url = 'http://localhost:5000/api/employee';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let dataEmployee = await response.json();
    dataEmployee = getIndex(dataEmployee);
    dataEmployee = getId(dataEmployee);
    return (dataEmployee);
}

export const clientInternalById = async (id) => {
    const url = `http://localhost:5000/api/clientInternal/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let dataClient = await response.json();
        return dataClient;
    }else{
        return 404
    }
    
}
export const clientExternalById = async (id) => {
    const url = `http://localhost:5000/api/clientExternal/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let dataClient = await response.json();
        return dataClient;
    }else{
        return 404
    }
    
}
export const employeeById = async (id) => {
    const url = `http://localhost:5000/api/employee/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let dataClient = await response.json();
        return dataClient;
    }else{
        return 404
    }
}
export const allMaterials = async (id) => {
    const url = 'http://localhost:5000/api/material';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let dataMaterial = await response.json();
    return (getIndex(dataMaterial));
    
}
export const materialsById = async (id) => {
    const url = `http://localhost:5000/api/material/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let dataClient = await response.json();
        return dataClient;
    }else{
        return 404
    } 
}

export const allJobs = async (id) => {
    const url = 'http://localhost:5000/api/job';
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    let dataJob = await response.json();
    return (getIndex(dataJob));
    
}
export const JobById = async (id) => {
    const url = `http://localhost:5000/api/job/${id}`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let dataJob = await response.json();
        return dataJob;
    }else{
        return 404
    }
}

export const orderInternalList = async (id) => {
    const url = `http://localhost:5000/api/orderInternal/list`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let data = await response.json();
        data = getIndex(data);
        data = getId(data);
        data = data.map(item=>{return {...item, client:item.institution}})
        
        return data;
    }else{
        return 404
    }
}
export const orderExternalList = async (id) => {
    const url = `http://localhost:5000/api/orderExternal/list`;
    const response = await fetch(url,{
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}
    })
    if(response.status!==404){
        let data = await response.json();
        data = getIndex(data);
        data = getId(data);
        data = data.map(item=>{return {...item, client:item.name}})

        return data;
    }else{
        return 404
    }
}