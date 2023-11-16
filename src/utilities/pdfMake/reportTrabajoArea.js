import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import image from '../../assets/images/uatf.png'; // Ruta de la imagen relativa
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headersTableWidth = {
  FECHA : 55,
  TRABAJO : 80,
  CLIENTE : 130,
  DETALLE : 150,
  "RECURSO UTILIZADO" : 70,
  CANTIDAD : 55,
  COSTO : 40,
  "EQUIPO UTILIZADO" : 70
}

const calculateWidths = (data) => {
  const widths = ['*',15];
  data.map(item => {
    widths.push(
      headersTableWidth[item.toUpperCase()]
    )
  })
  widths.push('*')
  return widths
}

const setMarginHeader = (text) => {
  const margin = 6;
  const abailables = ['FECHA', 'TRABAJO', 'CANTIDAD', 'CLIENTE', 'DETALLE', 'COSTO'];
  if (abailables.findIndex(item => text.toUpperCase()===item)===-1)
      return 0
  else
      return margin
};

function preprocessTableData(data) {

    let totalQuantity = false;
    let totalQuantityValue = 0;
    let quantityIndex = 0 ;

    let totalCost = false;
    let totalCostValue = 0;
    let costIndex = 0;

    const processedData = [];

    data.forEach((row, indexRow)=> {
        const newRow = [];

        if(indexRow === 0)
            newRow.push(
            {border: [false, false, false, false],text:''},
            {
                text: 'N°',
                fontSize:11,
                bold:true,
                alignment:'center',
                decoration: 'underline',
                marginTop: 6
            }
            )
        else
            newRow.push(
            {border: [false, false, false, false],text:''},
            {
                text: indexRow,
                fontSize:9,
                alignment:'center',
            }
            )

        row.forEach((cell, indexCell) => {
            let newCell;
            if(indexRow===0){
                if(cell.toUpperCase() === 'COSTO'){
                totalCost = true
                costIndex = indexCell
                }
                if(cell.toUpperCase() === 'CANTIDAD'){
                totalQuantity = true
                quantityIndex = indexCell
                }
                newCell = {
                    text: cell.toUpperCase(),
                    fontSize:11,
                    bold:true,
                    alignment:'center',
                    decoration: 'underline',
                    marginTop: setMarginHeader(cell)
                }
            }
            else{
                if(indexCell === costIndex)
                totalCostValue += Number(cell);
                if(indexCell === quantityIndex)
                totalQuantityValue += Number(cell);
                newCell = {
                    text: cell,
                    fontSize:9,
                    alignment: (cell.search(/^\d+$/)!==-1 || cell.search(/^[0-9\-.]+$/)!==-1)?'center':'left',
                }
            }
            newRow.push(newCell);
        })
        newRow.push({border: [false, false, false, false],text:''})

        processedData.push(newRow)
});

if(totalQuantity){
  let rowTotalQuantity = []  
  if (data[0].length === 1){
    rowTotalQuantity.push(
      {
        text: totalQuantityValue ,
        fillColor: '#B4B4B4',
        alignment: 'center'
      })
  }else{
    if((data[0].length === 2) && (totalQuantity && totalCost)){
      rowTotalQuantity.push(
        {
          text: totalQuantityValue ,
          fillColor: '#B4B4B4',
          alignment: 'center'
        },
        {}
      )
    }else{
      rowTotalQuantity.push(
        {
          text:'Suma Cantidad',
          alignment: 'right',
          colSpan: data[0].length - 2 + (totalCost ? 0 : 1)
        })
        
      for (let index = 0; index < data[0].length - 3 + (totalCost ? 0 : 1); index++) {
        rowTotalQuantity.push({})
      }
  
      rowTotalQuantity.push(
        {
          text: totalQuantityValue ,
          fillColor: '#B4B4B4',
          alignment: 'center'
        },
      )
  
      if(totalCost)
        rowTotalQuantity.push({})
    }
  }
  rowTotalQuantity.push({border: [false, false, false, false],text:''})
  rowTotalQuantity.unshift({border: [false, false, false, false],text:''},{})
  processedData.push(rowTotalQuantity)
}


if(totalCost){
  let rowTotalCost = [];
  if (data[0].length === 1){
    rowTotalCost.push(
      {
        text: totalCostValue,
        fillColor: '#B4B4B4',
        alignment: 'center'
      }
    )
  }else {
    if((data[0].length === 2) && (totalCost && totalQuantity)){
      rowTotalCost.push(
        {},
        {
          text: totalCostValue,
          fillColor: '#B4B4B4',
          alignment: 'center'
        })
    }else{
      rowTotalCost.push(
        {
          text:'Suma Costo',
          alignment: 'right',
          colSpan: data[0].length - 1 
        })
  
      for (let index = 0; index < data[0].length - 2; index++) {
        rowTotalCost.push({})
      }
  
      rowTotalCost.push(
        {
          text: totalCostValue,
          fillColor: '#B4B4B4',
          alignment: 'center'
        })
    }
  }
  rowTotalCost.push({border: [false, false, false, false],text:''})
  rowTotalCost.unshift({border: [false, false, false, false],text:''},{})

  processedData.push(rowTotalCost)
}

return processedData;
}

const loadImageAsDataUrl = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; 
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = imageUrl;
  });
};

export const generateReportTrabajoArea = async(data, start, end, area) => {

    const printDate = new Date();

    const fechas = `${(start && end)?`${start}  /  ${end}`:'Sin Intervalo'}`
    const title = `Sistema de Gestion de Trabajos de la Imprenta`
    const imageDataUrl = await loadImageAsDataUrl(image);

    var dd = {
        header: [
            {
                absolutePosition: { x: 0, y: 0 },
                canvas: [
                    {
                        type: 'rect', // Tipo de forma: rectángulo
                        x: 0, y: 6,   // Coordenadas de inicio (esquina superior izquierda)
                        w: 792, h: 3, // Ancho y alto del rectángulo
                        color: '#0A2E61' // Color de fondo del rectángulo
                    },
                    {
                        type: 'rect', // Tipo de forma: rectángulo
                        x: 0, y: 12,   // Coordenadas de inicio (esquina superior izquierda)
                        w: 792, h: 35, // Ancho y alto del rectángulo
                        color: '#FC0808' // Color de fondo del rectángulo
                    },
                    {
                        type: 'rect', // Tipo de forma: rectángulo
                        x: 0, y: 50,   // Coordenadas de inicio (esquina superior izquierda)
                        w: 792, h: 3, // Ancho y alto del rectángulo
                        color: '#0A2E61' // Color de fondo del rectángulo
                    }
                ]
            },
            {
                text: title,
                absolutePosition: { x: 30, y: 20 },// Posición del texto en relación al rectángulo
                color: 'white',
                fontSize:15,
                style: 'header',
                bold: true,
                alignment: 'center'
            },
        ],
          footer: function(currentPage, pageCount) { 
            return [
                {
                    absolutePosition: { x: 0, y: 0 },
                    canvas: [
                        {
                            type: 'rect', // Tipo de forma: rectángulo
                            x: 0, y: 20,   // Coordenadas de inicio (esquina superior izquierda)
                            w: 792, h: 40, // Ancho y alto del rectángulo
                            color: '#FC0808' // Color de fondo del rectángulo
                        },
                        {
                            type: 'rect', // Tipo de forma: rectángulo
                            x: 0, y: 14,   // Coordenadas de inicio (esquina superior izquierda)
                            w: 792, h: 3, // Ancho y alto del rectángulo
                            color: '#0A2E61' // Color de fondo del rectángulo
                        },
                        
                        {
                          type: 'rect', // Tipo de forma: rectángulo
                          x: 360, y: 14,   // Coordenadas de inicio (esquina superior izquierda)
                          w: 72, h: 13, // Ancho y alto del rectángulo
                          color: 'white' // Color de fondo del rectángulo
                        },
                        {
                          type: 'rect', // Tipo de forma: rectángulo
                          x: 365, y: 27,   // Coordenadas de inicio (esquina superior izquierda)
                          w: 62, h: 5, // Ancho y alto del rectángulo
                          color: 'white' // Color de fondo del rectángulo
                        },
                        {
                          type: 'ellipse',
                          x: 365, y: 27,
                          color: 'white',
                          r1: 5, r2: 5
                        },
                        {
                          type: 'ellipse',
                          x: 427, y: 27,
                          color: 'white',
                          r1: 5, r2: 5
                        },
                    ]
                },
                {
                    absolutePosition: { x: 0, y: 14 },
                    text:currentPage + ' / ' + pageCount,
                    color:'black',
                    bold: true,
                    fontSize: 11,
                    alignment: 'center'
                },
                {
                    absolutePosition: { x: 550, y: 30 },
                    text:'EDITORIAL E IMPRENTA UNIVERSITARIA',
                    color:'white',
                    bold: true,
                    fontSize: 12,
                },
                {
                    absolutePosition: { x: 50, y: 30 },
                    text:'D.I.S.U.',
                    color:'white',
                    bold: true,
                    fontSize: 15,
                },
                {
                  absolutePosition: { x: 625, y: 0 },
                  text: `Fecha de Impresion : ${printDate.toLocaleString()}`,
                  color:'black',
                  fontSize: 8,
                },
            ]; 
            
        },
        pageSize: 'letter',
        pageOrientation: 'landscape',
        pageMargins: [ 20, 70, 20, 60 ],
        background: [
          {
            image: imageDataUrl, // Ruta a tu imagen de marca de agua
            width: 250,
            height:300,// Ancho de la imagen
            opacity: 0.1,
            absolutePosition: { x: 271, y: 186 },
          }
        ],
        content: [
            {
                absolutePosition: { x: 20, y: 68 },
                canvas: [
                    
                    {
                        type: 'line', // Tipo de forma: rectángulo
                        x1: 10, y1: 100, // Coordenadas de inicio
                        x2: 732, y2: 100, // Coordenadas finales
                        lineWidth: 4, // Grosor de la línea
                        lineColor: '#C1C1C1' // Color de fondo del rectángulo
                    },
                    {
                        type: 'rect', // Tipo de forma: rectángulo
                        x: 10, y: 0,   // Coordenadas de inicio (esquina superior izquierda)
                        w: 722, h: 100, // Ancho y alto del rectángulo
                        color: '#E8E8E8' // Color de fondo del rectángulo
                    },
                ]
            },
            {
                margin:[25,10,25,10],
                columns: [
                    {
                        width: '27%',
                        text: 'Titulo de Reporte:\n\nArea :\n\nIntervalo de Fechas :\n\n',
                        color: 'black',
                        fontSize:12,
                        style: 'header',
                        bold: true    
                    },
                    {
                        text: `Registros de trabajos realizados en areas especificas\n\n${area}\n\n${fechas}`,
                        color: 'black',
                        fontSize:12,
                        style: 'header',
                    }
                ]
            },
            {
                marginTop:10,
                table: {
                    widths: calculateWidths(data[0]) ,
                    body: preprocessTableData(data)
                },
                layout: {
                  hLineWidth: function (i, node) {
                    if (i === 1 || i === data.length)
                        return 1.5
                    else if (i > 1 && i < data.length )
                        return 1
                    else
                        return 0
                  },
                  vLineWidth: function (i, node) {
                    return 0;
                  },
                  hLineColor: function (i, node) {
                    return i === 1 || i === data.length ? 'black' :'gray';
                  },
                }
            }
        ]
        
    }
    pdfMake.createPdf(dd).open();
}