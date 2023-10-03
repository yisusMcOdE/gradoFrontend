import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;



export const generateDeliveryCertificate = (data) => {

    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      
      // Formatea la fecha
      const formatoFecha = new Intl.DateTimeFormat('es-ES', opciones).format(new Date());

    var dd = {
        pageMargins: [ 20, 40, 20, 180 ],
        pageSize:'letter',
        footer: function(currentPage, pageCount) { 
            return [
                {
                    marginTop:20,
                    columns:[
                        [   {
                                text:'ENTREGA',
                                alignment:'center'
                            },
                            {
                                marginTop:35,
                                table:{
                                    heights: [35],
                                    widths:['*',150,'*'],
                                    body:[
                                        [
                                            {
                                                text:'',
                                                border:[false,false,false,false]
                                            },
                                            {
                                                text:'Jesus Morales Perez',
                                                alignment:'center',
                                                border:[false,true,false,false]
                                            },
                                            {
                                                text:'',
                                                border:[false,false,false,false]
                                            }
                                        ]
                                    ]
                                }
                            }
                        ],
                        [
                            {
                                text:'RECIBE',
                                alignment:'center'
                            },
                            {
                                marginTop:35,
                                table:{
                                    heights: [35],
                                    widths:['*',150,'*'],
                                    body:[
                                        [
                                            {
                                                text:'',
                                                border:[false,false,false,false]
                                            },
                                            {
                                                text: data.client,
                                                alignment:'center',
                                                border:[false,true,false,false]
                                            },
                                            {
                                                text:'',
                                                border:[false,false,false,false]
                                            }
                                        ]
                                    ]
                                }
                            }
                        ]
                    ]
                },
                {
                    text:`${currentPage} / ${pageCount}`,
                    alignment:'center'
                }
            ]
        },
        content: [
            {
                text:'ACTA DE ENTREGA',
                bold:true,
                fontSize:20,
                alignment:'center',
                margin:[20,30,20,50]
            },
            {
                text:[
                    `En fecha ${formatoFecha}, se hace la entrega al señor `,
                    {
                        text:`${data.courier?.toUpperCase() || data.client.toUpperCase()}, `,
                        bold:true
                    },
                    {
                        text:`${data.courier?'encargado de ':'identificado con CI '}`
                    },
                    {
                        text:`${data.courier ? data.client.toUpperCase() : data.ci}`,
                        bold:true
                    },
                    ', los siguientes trabajos realizados por la Imprenta Universitaria'
                ],
                margin:[50,0,50,30],
                lineHeight:1.3
            },
            {
                table: {
                    widths: ['*',15, '*', 60,'*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},'N°', 'DESCRIPCION', 'CANTIDAD',{text:'',border:[false,false,false,false]}]
                        ].concat(data.details.map((item, index)=>{
                            return [
                                {text:'',border:[false,false,false,false]},
                                index + 1,
                                item.job,
                                item.deliveredQuantity,
                                {text:'',border:[false,false,false,false]}
                            ]
                    }))
                }
            },
            
        ]
        
    }

    pdfMake.createPdf(dd).open();
}