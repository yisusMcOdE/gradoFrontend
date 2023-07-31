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
                'rgb(255, 99, 132)',
                
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)'
              ],
        }]
    }
    return format
}