import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import numbers from "numeros_to_words";

pdfMake.vfs = pdfFonts.pdfMake.vfs;



export const generateTicketPay = async(data,details) => {

    numbers().Config._setSingular('BOLIVIANO');
    numbers().Config._setPlural('BOLIVIANOS');
    numbers().Config._setCentsSingular('CENTAVO');
    numbers().Config._setCentsPlural('CENTAVOS');

    let numberTicket = String(data.numberTicketPay);
    numberTicket = ''.concat('0'.repeat(6 - numberTicket.length),numberTicket);
    let costTotalLiteral = numbers(data.cost).toString();
    let costTotal = data.cost;


    var dd = {
        footer: function(currentPage, pageCount) {
            return [
              {
                absolutePosition:{ x: 0, y: -122.5 },
                canvas: [
                    {
                      type: 'rect', // Tipo de forma: rectángulo
                      x: 10, y: 8,   // Coordenadas de inicio (esquina superior izquierda)
                      w: 190, h: 131, // Ancho y alto del rectángulo
                      r: 3, // Radio de las esquinas para hacer los bordes redondeados
                      color: 'black', // Color de contorno del rectángulo
                      lineWidth: 0.6, // Grosor de línea del contorno,
                      lineColor:'black',
                      color:''
                    },
                    {
                      type: 'rect', // Tipo de forma: rectángulo
                      x: 11, y: 9,   // Coordenadas de inicio (esquina superior izquierda)
                      w: 188, h: 129, // Ancho y alto del rectángulo
                      r: 3, // Radio de las esquinas para hacer los bordes redondeados
                      color: 'black', // Color de contorno del rectángulo
                      lineWidth: 0.5, // Grosor de línea del contorno,
                      lineColor:'black',
                      color:''
                    }
                ]
            },
              {
                marginLeft:20,
                columns:[
                    {
                        text: 'DIRECTOR D.I.S.E.U',
                        width:45,
                        fontSize:4,
                        alignment:'center',
                        marginTop:10,
    
                    },
                    {
                        text: 'RESPONSABLE - IMPRENTA UNIVERSITARIA',
                        fontSize:4,
                        alignment:'center',
                        marginTop:10,
                    },
                    {
                        text: `${currentPage} / ${pageCount}`,
                        width:25,
                        alignment: 'rigth',
                        fontSize:4,
                        marginTop:10,
                    }
                ]
            }
            ];
          },
        pageSize:'A8',
        pageOrientation: 'landscape',
        pageMargins: [13, 11, 13, 25],
        content: [
            {
                columns:[
                    {
                        text: 'Image',
                        width: 50,
                        height: 18,
                    }, 
                    {
                        text:`N° ${numberTicket}`,
                        fontSize:7,
                        alignment: 'center'
                        
                    }, 
                    {
                        text:'UNIVERSIDAD AUTÓNOMA "TOMAS FRIAS"',
                        fontSize:4,
                        alignment: 'center',
                        width: 50,
                    },
                ]
            },
            {
                text: `BOLETA "PAGO DE TRABAJO" POR Bs. ${costTotal}`,
                fontSize:7,
                alignment: 'center',
                bold:true,
                marginTop:2
            },
            {
                text: `A NOMBRE DE : ${data.client}`, 
                fontSize:5,
                marginLeft:3,
                marginTop:5
                
            },
            {
                marginTop:3,
                table:{
                    widths: [18,'*',14,12],
                    lineWidth: 3,
                    body:[
                        [
                            {
                                text:'ITEM',
                                fontSize:5,
                                alignment:'center'
                            },
                            {
                                text:'DESCRIPCION',
                                fontSize:5,
                                alignment:'center'
                            },
                            {
                                text:'CANTIDAD UNITARIO',
                                fontSize:3,
                                
                            },
                            {
                                text:'COSTO',
                                fontSize:3,
                                alignment:'center',
                                margin: [1, 1.4, 1, 1]
                                
                            },
                        ]
                    ].concat(details.map(item => {
                        return [
                            {
                                text : item.job,
                                fontSize : 3,
                                alignment : 'center'
                            },
                            {
                                text : item.detail,
                                fontSize : 3,
                                alignment : 'left'
                            },
                            {
                                text : item.requiredQuantity,
                                fontSize : 3,
                                alignment : 'center'
                            },
                            {
                                text : item.cost,
                                fontSize : 3,
                                alignment : 'center'
                            },
                       ]
                    }))
                },
                layout: {
                    hLineWidth: function (i, node) {
                    return  0.5; // Grosor de líneas horizontales
                    },
                    vLineWidth: function (i, node) {
                    return  0.5; // Grosor de líneas verticales
                    }
                },
            },
            {
                marginTop:1,
                columns:[
                    {
                        width:155,
                        text: `LA SUMA DE : ${costTotalLiteral}`,
                        fontSize:5,
                        marginTop:1.5
                    },
                    [
                        {
                            table:{
                                widths: ['*', 12],
                                body:[
                                    [
                                        {
                                            text:'',
                                            border: [false, false, false, false],
                                        },
                                        {
                                            text:costTotal,
                                            fontSize:3
                                        }
                                    ]    
                                ]
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                return  0.1; // Grosor de líneas horizontales
                                },
                                vLineWidth: function (i, node) {
                                return  0.1; // Grosor de líneas verticales
                                }
                            },
                        }
                        ,
                        {
                            text: 'COSTO TOTAL',
                            fontSize:3,
                            alignment:'right',
                            marginTop:1
                        }
                    ]
                    
                ]
            }
        ]
    }
    pdfMake.createPdf(dd).open();
}