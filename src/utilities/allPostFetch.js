const token = localStorage.token;

const myPost = async(url, body) => {

    ///const myIpResponse = await fetch('https://api.ipify.org/?format=json');
    ///const myIp = await myIpResponse.json();


    const response = await fetch(url,{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    ///let data = await response.json();
    return response
}

export const createUser = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/users`;
    return (myPost(url,data));
}

export const createClientExternal = async(data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/clientExternal`;
    return (myPost(url,data));
}

export const createClient = async(data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/clientInternal`;
    return (myPost(url,data));
}

export const createEmployee = async(data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/employee`;
    return (myPost(url,data));
}

export const createMaterial = async(data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/material`;
    return (myPost(url,data));
}

export const createJob = async(data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/job`;
    return (myPost(url,data));
}

export const createOrderExternal = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/orderExternal`;
    return (myPost(url,data));
}

export const createOrderInternal = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/orderInternal`;
    return (myPost(url,data));
}

export const createOrderMaterial = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/material/order`;
    return (myPost(url,data));
}

export const updateConfigBackup = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/configBackup`;
    return (myPost(url,data));
}

export const restoreBackup = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/configBackup/restore`;
    return (myPost(url, data));
}

export const addDelayById = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/step/delay`;
    return (myPost(url, data));
}

export const AddEquipment = async (data) => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/equipment`;
    return (myPost(url, data));
}

export const addBackUp = async () => {
    const url = `${process.env.REACT_APP_SERVER_HOST}/api/configBackup/generate`;
    return (myPost(url, {}));
}
