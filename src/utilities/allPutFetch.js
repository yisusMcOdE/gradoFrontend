const token = localStorage.token;

const diferential = (dataActually, oldData) => {
    const newData = {};
    for (const key in dataActually) {
        if(dataActually[key]!==oldData[key]){
            newData[key]=dataActually[key]
        }
    }
    return newData;
}


export const updateClientInternal = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/clientInternal/${id}`;
    const body = diferential(newData,oldData);
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    let dataClient = await response.json();
    return dataClient
}
export const updateClientExternal = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/clientExternal/${id}`;
    const body = diferential(newData,oldData);
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    let dataClient = await response.json();
    return dataClient
}

export const updateEmployee = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/employee/${id}`;
    const body = diferential(newData,oldData);
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    let dataEmployee = await response.json();
    return dataEmployee
}

export const updateMaterial = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/material/${id}`;
    const body = diferential(newData,oldData);
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    console.log(response);
    let dataMaterial = await response.json();
    
    return dataMaterial
}
export const updateJob = async(id,newData) => {
    const url = `http://localhost:5000/api/job/${id}`;
    const body = newData;
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    console.log(response);
    let dataJob = await response.json();
    
    return dataJob
}