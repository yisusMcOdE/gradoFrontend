const token = localStorage.token;

export const createClientExternal = async(data) => {
    const url = `http://localhost:5000/api/clientExternal`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let dataClient = await response.json();
    return dataClient
}

export const createClient = async(data) => {
    const url = `http://localhost:5000/api/clientInternal`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let dataClient = await response.json();
    return dataClient
}

export const createEmployee = async(data) => {
    const url = `http://localhost:5000/api/employee`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let dataEmployee = await response.json();
    return dataEmployee
}

export const createMaterial = async(data) => {
    const url = `http://localhost:5000/api/material`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let dataMaterial = await response.json();
    return dataMaterial
}

export const createJob = async(data) => {
    const url = `http://localhost:5000/api/job`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let dataMaterial = await response.json();
    return dataMaterial
}

export const createOrderExternal = async (data) => {
    const url = `http://localhost:5000/api/orderExternal`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let orderInternal = await response.json();
    return orderInternal
}

export const createOrderInternal = async (data) => {
    const url = `http://localhost:5000/api/orderInternal`;
    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(data)
    })
    let orderExternal = await response.json();
    return orderExternal
}