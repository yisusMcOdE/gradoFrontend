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
    let data = await response.json();
    return data
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