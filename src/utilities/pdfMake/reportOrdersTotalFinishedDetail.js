import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import image from '../../assets/images/uatf.png'; // Ruta de la imagen relativa
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headers = ['fecha registro', 'fecha entrega', 'cliente', 'trabajo', 'detalle', 'cantidad', 'costo']

const headersTableWidth = {
  "FECHA REGISTRO" : 55,
  "FECHA ENTREGA" : 80,
  CLIENTE : 150,
  TRABAJO : 200,
  DETALLE: 70,
  CANTIDAD : 55,
  COSTO : 40
}

const calculateWidths = () => {
  const widths = ['*',15,55,55,100,100,220,55,55,'*'];
  /*data.map(item => {
    widths.push(
      headersTableWidth[item.toUpperCase()]
    )
  })*/
  return widths
}

const setMarginHeader = (text) => {
  const margin = 6;
  const abailables = ['CLIENTE', 'TRABAJO', 'DETALLE', 'CANTIDAD', 'COSTO'];
  if (abailables.findIndex(item => text.toUpperCase()===item)===-1)
      return 0
  else
      return margin
};

const dashLines = (data) => {
    const dash=[];
    let position = 1;
    for (let index = 0; index < data.length; index++) {
        const order = data[index];
        if(order.details.length === 1){
            position += 2
        }else{
            order.details.map((item,index) => {
                if(index+1 !== order.details.length){
                    position++;
                    dash.push(position);
                }
            })
            position += 2
        }
    }
    return dash
}

const secondLines = (data) => {
    const second=[];
    let position=1;
    for (let index = 0; index < data.length; index++) {
        const order = data[index];
        if(order.details.length === 1){
            position ++;
            second.push(position);
            position ++;
        }else{
            position += order.details.length
            second.push(position);
            position ++;
        }
    }
    return second
}

const thirdLines = (data) => {
    const third=[];
    let position=1;
    for (let index = 0; index < data.length; index++) {
        const order = data[index];
        if(order.details.length === 1){
            position +=2;
            third.push(position);
            
        }else{
            position += order.details.length + 1
            third.push(position);
        }
    }
    return third
}

function preprocessTableData(data) {

  let totalCostValueByOrder = 0;
  let totalCostValue = 0;

  const processedData = [];

    ///HEADERS

    const rowHeaders = [
        {border: [false, false, false, false],text:''},
        {
        text: 'N°',
        fontSize:11,
        bold:true,
        alignment:'center',
        decoration: 'underline',
        marginTop: 6
        }
    ];
    headers.map(item => {
        rowHeaders.push(
            {
                text: item.toUpperCase(),
                fontSize:11,
                bold:true,
                alignment:'center',
                decoration: 'underline',
                marginTop: setMarginHeader(item)
            }
        )
    })
    rowHeaders.push({border: [false, false, false, false],text:''});
    processedData.push(rowHeaders);

////////////
  data.forEach((row, indexRow)=> {
        let totalCostValueByOrder = 0;

      let newRow = [];
      newRow.push(
          {border: [false, false, false, false],text:''},
          {
            border:[false,true,false,false],
            rowSpan: 1 + row.details.length,
            text: indexRow + 1,
            fontSize:9,
            alignment:'center',
          },
          {
            border:[false,true,false,false],
            rowSpan: 1 + row.details.length,
            text: row.dateRegister,
            fontSize:9,
            alignment:'center'
          },
          {
            border:[false,true,false,false],
            rowSpan: 1 + row.details.length,
            text: row.dateDelivered,
            fontSize:9,
            alignment:'center'
          },
          {
            border:[false,true,false,false],
            rowSpan: 1 + row.details.length,
            text: row.client,
            fontSize:9,
          }
      )

      ///DETALLE DE PEDIDO
      row.details.forEach((detail, indexDetail)=>{
          if(indexDetail === 0){
            newRow.push(
              {
                text: detail.job,
                fontSize:9,
              },
              {
                text: detail.detail,
                fontSize: 9
              },
              {
                text: detail.deliveredQuantity,
                fontSize: 9,
                alignment:'center'
              },
              {
                text: detail.cost,
                fontSize: 9,
                alignment:'center'
              },
              {border: [false, false, false, false],text:''}
            );
            processedData.push(newRow);
            totalCostValueByOrder += detail.cost
          }else{
            newRow=[
              {border: [false, false, false, false],text:''},
              {
                border: [false,false,false,false],
                text:'',
                colSpan:4
              },{},{},{},
              {
                text: detail.job,
                fontSize:9,
              },
              {
                text: detail.detail,
                fontSize: 9
              },
              {
                text: detail.deliveredQuantity,
                fontSize: 9,
                alignment:'center'
              },
              {
                text: detail.cost,
                fontSize: 9,
                alignment:'center'
              },
              {border: [false, false, false, false],text:''}
            ]
            processedData.push(newRow);
            totalCostValueByOrder += detail.cost
          }
      });

      newRow=[
        {border: [false, false, false, false],text:''},
        {
            border: [false, false, false, false],
            text:'',
            colSpan:7
        },{},{},{},{},{},{},
        {
          text: `Bs. ${totalCostValueByOrder}`,
          bold:true,
          fontSize: 11,
          alignment:'center'
        },
        {border: [false, false, false, false],text:''}
      ]
      processedData.push(newRow);
      totalCostValue += totalCostValueByOrder
  
})

const FinalRow=[
    {border: [false, false, false, false],text:''},
    {
      text:'MONTO TOTAL :',
      bold:true,
      fontSize: 11,
      alignment:'right',
      colSpan:7
    },{},{},{},{},{},{},
    {
      text: `Bs. ${totalCostValue}`,
      bold:true,
      fontSize: 11,
      alignment:'center'
    },
    {border: [false, false, false, false],text:''}
  ]
  processedData.push(FinalRow);

console.log([...processedData]);
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

export const generateReportTotalTotal = async(data, start, end, area) => {

    const dashLinesArray = dashLines(data);
    const secondLinesArray = secondLines(data);
    const thirdLinesArray = thirdLines(data);

    console.log('dash',dashLinesArray);
    console.log('second',secondLinesArray);
    console.log('third',thirdLinesArray);

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
                        x1: 10, y1: 70, // Coordenadas de inicio
                        x2: 732, y2: 70, // Coordenadas finales
                        lineWidth: 4, // Grosor de la línea
                        lineColor: '#C1C1C1' // Color de fondo del rectángulo
                    },
                    {
                        type: 'rect', // Tipo de forma: rectángulo
                        x: 10, y: 0,   // Coordenadas de inicio (esquina superior izquierda)
                        w: 722, h: 70, // Ancho y alto del rectángulo
                        color: '#E8E8E8' // Color de fondo del rectángulo
                    }
                ]
            },
            {
                margin:[25,10,25,10],
                columns: [
                    {
                        width: '27%',
                        text: 'Titulo de Reporte:\n\nIntervalo de Fechas :\n\n',
                        color: 'black',
                        fontSize:12,
                        style: 'header',
                        bold: true    
                    },
                    {
                        text: `Registros detallado de trabajos realizados por la imprenta\n\n${fechas}`,
                        color: 'black',
                        fontSize:12,
                        style: 'header',
                    }
                ]
            },
            {
                marginTop:10,
                table: {
                    widths: calculateWidths() ,
                    body: preprocessTableData(data)
                },
                layout: {
                    vLineWidth: function (i, node) {
                        return 0;
                    },
                    hLineWidth: function (i, node) {
                        /// Linea superior inferior tabla
                        if ([1,(node.table.body.length-1)].includes(i))
                            return 2;

                        /// Lineas segmentadas
                        if (dashLinesArray.includes(i))
                            return 0.5
                        
                        /// Lineas secundarias
                        if (secondLinesArray.includes(i))
                            return 0.5
                        
                        if (thirdLinesArray.includes(i))
                            return 1
                    },
                    
                    hLineColor: function (i, node) {
                        /// Linea superior inferior tabla
                        if ([1,(node.table.body.length-1)].includes(i))
                            return 'black';

                        /// Lineas segmentadas
                        if (dashLinesArray.includes(i))
                            return 'gray'
                        
                        /// Lineas secundarias
                        if (secondLinesArray.includes(i))
                            return 'gray'

                        /// Lineas terciarias
                        if (thirdLinesArray.includes(i))
                            return 'black'
                    },

                    hLineStyle: function (i, node) {
                        if (dashLinesArray.includes(i))
                            return {dash: {length: 2, space: 1}};
                    },
                  
                }
            }
        ]
        
    }
    pdfMake.createPdf(dd).open();
}