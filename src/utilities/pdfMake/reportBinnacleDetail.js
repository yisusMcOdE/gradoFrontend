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
                    },
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
                        text: `Registros detallado de bitacora del sistema\n\n${fechas}`,
                        color: 'black',
                        fontSize:12,
                        style: 'header',
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