export const formatCharPie = (data=[]) => {

    const item = data[0];
    const keys = [];
    const values = [];
    for(const key in item){
        keys.push(key);
        values.push(item[key]);
    }
    
    const format = {
        labels: keys,
        datasets: [{
            data:values,
            backgroundColor: [
                '#9A3A4D',
                
                '#856F39',
                '#2A6790'
              ],
        }]
    }
    return format
}