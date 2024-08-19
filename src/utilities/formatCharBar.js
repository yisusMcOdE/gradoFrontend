
export const formatCharBar = (data=[]) => {


    const format = {
        labels : data.map(item=>item.nombre),
        datasets : [{
            label:"",
            data:data.map(item=>item.sobrante),
            backgroundColor: 'white',
        }]
    }
    return format
}
