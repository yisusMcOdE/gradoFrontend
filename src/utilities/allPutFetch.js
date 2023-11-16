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

const myPut = async(url, body) => {
    const response = await fetch(url,{
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
    })
    return response
}


export const updateClientInternal = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/clientInternal/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}
export const updateClientExternal = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/clientExternal/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}

export const updateEmployee = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/employee/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}

export const updateMaterial = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/material/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}
export const updateJob = async(id,newData) => {
    const url = `http://localhost:5000/api/job/${id}`;
    const body = newData;
    return(myPut(url, body));
}
export const confirmOrderMaterial = async (id, newData) => {
    const url = `http://localhost:5000/api/material/order/confirm/${id}`;
    const body = newData;
    return(myPut(url, body));
}
export const cancelOrderMaterialById = async (id) => {
    const url = `http://localhost:5000/api/material/order/cancel/${id}`;
    return(myPut(url, {}));
}
export const confirmOrder = async (id, data) => {
    const url = `http://localhost:5000/api/orders/confirm/${id}`;
    const body = data;
    return(myPut(url,body));
}
export const updateSchedule = async (data) => {
    const url = 'http://localhost:5000/api/schedule/update';
    const body = data;
    return(myPut(url,body));
}

export const finishOrderById = async (id, body) => {
    const url = `http://localhost:5000/api/orders/finish/${id}`;
    return (myPut(url, body));
}

export const cancelOrderById = async (id) => {
    const url = `http://localhost:5000/api/orders/cancel/${id}`;
    return (myPut(url,{}));
}

export const updateEquipment = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/equipment/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}

export const finishTotalOrderById = async (id) => {
    const url = `http://localhost:5000/api/orders/finishTotal/${id}`;
    return (myPut(url, {}));
}

export const updateOver = async (data) => {
    const url = 'http://localhost:5000/api/material/over';
    return (myPut(url, data));
}

export const updateUser = async(id,newData,oldData) => {
    const url = `http://localhost:5000/api/users/${id}`;
    const body = diferential(newData,oldData);
    return(myPut(url, body));
}

export const addStepById = async (id) => {
    const url = `http://localhost:5000/api/step/next/${id}`;
    let response = await myPut(url,{});
    return (response);
}

export const logoutWWeb = async () => {
    const url = 'http://localhost:5000/api/whatsapp/logout';
    let response = await myPut(url,{});
    return (response);
}

export const updateNotificationsWWeb = async (state) => {
    const url = 'http://localhost:5000/api/whatsapp/notifications';
    let response = await myPut(url,{notifications:state});
    return (response);
}

export const updateConfigEmail = async(body) => {
    const url = 'http://localhost:5000/api/email';
    let response = await myPut(url,body);
    return (response);
}

export const updateCharges = async(body) => {
    const url = 'http://localhost:5000/api/charges';
    let response = await myPut(url,body);
    return (response);
}

export const updateConfigBinnacle = async(body) => {
    const url = 'http://localhost:5000/api/binnacle';
    let response = await myPut(url,body);
    return (response);
}