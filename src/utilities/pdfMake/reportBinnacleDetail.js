import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import image from '../../assets/images/uatf.png'; // Ruta de la imagen relativa
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headers = ['usuario', 'metodo', 'endpoint', 'fecha', 'hora', 'valores utilizados','resultado']

const calculateWidths = () => {
  const widths = [20,60,40,70,50,40,340,60];
  return widths
}

const setMarginHeader = (text) => {
  const margin = 6;
  const abailables = [];
  if (abailables.findIndex(item => text.toUpperCase()===item)===-1)
      return 0
  else
      return margin
};

function preprocessTableData(data) {

  const processedData = [];

    ///HEADERS

    const rowHeaders = [
        
        {
        text: 'N°',
        fontSize:9,
        bold:true,
        alignment:'center',
        decoration: 'underline',
        }
    ];
    headers.map(item => {
        rowHeaders.push(
            {
                text: item.toUpperCase(),
                fontSize:9,
                bold:true,
                alignment:'center',
                decoration: 'underline',
                marginTop: setMarginHeader(item)
            }
        )
    })
    processedData.push(rowHeaders);

////////////
  data.forEach((row, indexRow)=> {
        let newRow = [];
        newRow.push(
            {
                text: indexRow + 1,
                fontSize:9,
                alignment:'center',
            },
            {
                text: row.user || '',
                fontSize:9,
                alignment:'center'
            },
            {
                text: row.method || '',
                fontSize:9,
                alignment:'center'
            },
            {
                text: row.route || '',
                fontSize:9,
            },
            {
                text: row.date || '',
                fontSize:9,
                alignment:'center'
            },
            {
                text: row.time || '',
                fontSize:9,
                alignment:'center'
            }
        );
        

        const bodyValues = [];
            if(row.params!==undefined)
                if(row.params!=='{}')
                    bodyValues.push([{text: 'Parametros',fontSize:9,},{text:`${row.params}`,fontSize:9,}],)

            if(row.queries!==undefined)
                if(row.queries!=='{}')
                    bodyValues.push([{text: 'Consulta',fontSize:9,},{text:`${row.queries}`,fontSize:9,}],)

            if(row.inputValues!==undefined)
                if(row.inputValues!=='{}')
                    bodyValues.push([{text: 'Entrada',fontSize:9,},{text:`${row.inputValues}`,fontSize:9,}],)

            if(row.oldValues!==undefined)
                if(row.oldValues!=='{}')
                    bodyValues.push([{text: 'Salida',fontSize:9,},{text:`${row.oldValues}`,fontSize:9,}],)
        
        if(bodyValues.length!==0){
            newRow.push({
                table: {
                    widths:[50,262],
                    body: bodyValues
                },
                layout: {
                    hLineWidth: function (i, node) {
                        if (i !== 0 || i !== bodyValues.length)
                              return 1
                        else
                            return 0
                    },
                    vLineWidth: function (i, node) {
                      return 0;
                    },
                    hLineColor: function (i, node) {
                      return 'gray';
                    },
                  }
            })
        }else{
            newRow.push({text:'SIN VALORES UTILIZADOS',fontSize:9,alignment:'center'})
        }

        newRow.push(
            {
                text: row.successful || '',
                fontSize:9,
                alignment:'center'
            },
        )
    processedData.push(newRow);
})
console.log(processedData);
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

export const generateReportBinnacleDetail = async(data, start, end, area) => {

    console.log('dataSelect:', data);

    const printDate = new Date();

    const title = 'REPORTE DETALLADO DE BITACORA'
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
              type: 'ellipse',
              x: 396, y: 16,
              color: 'white',
              r1: 30, r2: 30
                },
                    ]
                },
                {
                    absolutePosition: { x: 0, y: 14 },
                    text:currentPage + ' / ' + pageCount,
                    color:'black',
                    bold: true,
                    fontSize: 18,
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
                  absolutePosition: { x: 600, y: 0 },
                  text: `Fecha de Impresion : ${printDate.toLocaleString()}`,
                  color:'black',
                  fontSize: 10,
                },
            ]; 
            
        },
        pageSize: 'letter',
        pageOrientation: 'landscape',
        pageMargins: [ 20, 40, 20, 60 ],
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
                    widths: calculateWidths() ,
                    body: preprocessTableData(data)
                },
                layout: {
                    hLineWidth: function (i, node) {
                      if (i === 1 || i === data.length + 1)
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
                      return i === 1 || i === data.length + 1 ? 'black' :'gray';
                    },
                  }
            }
        ]
        
    }
    pdfMake.createPdf(dd).open();
}