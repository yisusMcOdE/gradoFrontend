import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export const generateReport = (data) => {
    var dd = {
        pageSize: 'letter',
        content: [
            {
                
                table: {
                    widths: [15, '*', '*', '*', '*', '*'],
                    body: data.map(row=>{
                        return row.map(element=>{
                            return {text:element}
                        })
                    })
                }
                
            }
        ]
        
    }
    pdfMake.createPdf(dd).open();
}