import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import image from '../../assets/images/uatf.png'; // Ruta de la imagen relativa
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headersTableWidth = {
  "FECHA REGISTRO" : 55,
  "FECHA ENTREGA" : 55,
  CLIENTE : 80,
  "TRABAJOS ENTREGADOS" : 200,
  "COSTO TOTAL" : 40
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
  const abailables = ['CLIENTE', 'TRABAJOS ENTREGADOS'];
  if (abailables.findIndex(item => text.toUpperCase()===item) === -1)
      return 0
  else
      return margin
};

function preprocessTableData(data) {

  let result = false;
  let resultValue = 0;
  let resultIndex = 0 ;

  const processedData = [];

  data.forEach((row, indexRow)=> {
      const newRow = [];

      ///Agregando Indice
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

        ///Completando Fila por Fila
      row.forEach((cell, indexCell) => {
          let newCell;
          if(indexRow===0){
            if(cell.toUpperCase() === 'COSTO TOTAL'){
                result = true
                resultIndex = indexCell
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
            if(indexCell === resultIndex)
                resultValue += Number(cell);

            newCell = {
                text: cell,
                fontSize:9,
                alignment: (cell.search(/^\d+$/)!==-1 || cell.replaceAll(' ','').search(/^[0-9\-.+]+$/)!==-1)?'center':'left',
            }
          }
        newRow.push(newCell);
      })
      newRow.push({border: [false, false, false, false],text:''})

      processedData.push(newRow)
});


if(result){
  let rowTotalResult = [];
  if (data[0].length === 1){
    rowTotalResult.push(
      {
        text: resultValue,
        fillColor: '#B4B4B4',
        alignment: 'center'
      }
    )
  }else{
      rowTotalResult.push(
        {
          text:'Suma Total',
          alignment: 'right',
          colSpan: data[0].length - 1 
        })
  
      for (let index = 0; index < data[0].length - 2; index++) {
        rowTotalResult.push({})
      }
  
      rowTotalResult.push(
        {
          text: resultValue,
          fillColor: '#B4B4B4',
          alignment: 'center'
        })
    }
  rowTotalResult.push({border: [false, false, false, false],text:''})
  rowTotalResult.unshift({border: [false, false, false, false],text:''},{})

  processedData.push(rowTotalResult)
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

export const generateReportOrdersTotalFinished = async(data, start, end) => {

    const printDate = new Date();

    const title = `REPORTE GENERAL DE PEDIDOS FINALIZADOS POR LA IMPRENTA UNIVERSITARIA ${(start && end)? `CORRESPONDIENTES A LAS FECHAS " ${start} - ${end} "` : ''}`
    const imageDataUrl = await loadImageAsDataUrl(image);

    var dd = {
          footer: function(currentPage, pageCount) { 
            return [
                {
                    absolutePosition: { x: 0, y: 0 },
                    canvas: [
                        {
                            type: 'rect', // Tipo de forma: rectángulo
                            x: 0, y: 20,   // Coordenadas de inicio (esquina superior izquierda)
                            w: 612, h: 40, // Ancho y alto del rectángulo
                            color: '#FC0808' // Color de fondo del rectángulo
                        },
                        {
                            type: 'rect', // Tipo de forma: rectángulo
                            x: 0, y: 14,   // Coordenadas de inicio (esquina superior izquierda)
                            w: 612, h: 3, // Ancho y alto del rectángulo
                            color: '#0A2E61' // Color de fondo del rectángulo
                        },
                        {
                            type: 'ellipse',
                            x: 306, y: 16,
                            color: 'white',
                            r1: 20, r2: 20
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
                    absolutePosition: { x: 370, y: 30 },
                    text:'EDITORIAL E IMPRENTA UNIVERSITARIA',
                    color:'white',
                    bold: true,
                    fontSize: 12,
                },
                {
                    absolutePosition: { x: 40, y: 30 },
                    text:'D.I.S.U.',
                    color:'white',
                    bold: true,
                    fontSize: 13,
                },
                {
                  absolutePosition: { x: 420, y: 0 },
                  text: `Fecha de Impresion : ${printDate.toLocaleString()}`,
                  color:'black',
                  fontSize: 10,
                },
            ]; 
            
        },
        pageSize: 'letter',
        pageMargins: [ 20, 40, 20, 60 ],
        background: [
          {
            image: imageDataUrl, // Ruta a tu imagen de marca de agua
            width: 250,
            height:300,// Ancho de la imagen
            opacity: 0.1,
            absolutePosition: { x: 186, y: 271 },
          }
        ],
        content: [
          {
            canvas: [
              {
                type: 'rect', // Tipo de forma: rectángulo
                x: -20, y: 0,   // Coordenadas de inicio (esquina superior izquierda)
                w: 792, h: 50, // Ancho y alto del rectángulo
                color: '#FC0808' // Color de fondo del rectángulo
              },
              {
                type: 'rect', // Tipo de forma: rectángulo
                x: -20, y: -5,   // Coordenadas de inicio (esquina superior izquierda)
                w: 792, h: 3, // Ancho y alto del rectángulo
                color: '#0A2E61' // Color de fondo del rectángulo
              },
              {
                type: 'rect', // Tipo de forma: rectángulo
                x: -20, y: 51.5,   // Coordenadas de inicio (esquina superior izquierda)
                w: 792, h: 3, // Ancho y alto del rectángulo
                color: '#0A2E61' // Color de fondo del rectángulo
              }
            ]
          },
              {
                text: title,
                absolutePosition: { x: 30, y: 45 },// Posición del texto en relación al rectángulo
                color: 'white',
                fontSize:15,
                style: 'header',
                bold: true,
                alignment: 'center'
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