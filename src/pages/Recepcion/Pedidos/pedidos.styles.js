import { makeStyles } from "@mui/styles"

export const useStyles = makeStyles(theme=>({
    areaContainer:{
        placeContent: 'center',
        display:'grid'
    },
    indexContainer:{
        margin:'5rem 0',
    },
    titlePage:{
        textAlign: 'center',
        marginTop: '0'
    },

    ////----NUEVO PEDIDO----////

    nuevoPedidoContainer:{
        margin:'5rem 0',
        width: '50rem',
    },
    tableHeader:{
        background:'#464646',
        color:'white',
        border:'1px solid white',
        '& .MuiGrid-item':{
            border:'1px solid gray'
        },
        '& h3':{
            textAlign:'center'
        }
    },
    tableBody:{
        color:'black',
        '& .MuiGrid-item':{
            display:'flex',
            placeContent:'center',
            padding:'0 5px',
            '& .MuiFormControl-root':{
                marginBottom:'5px'
            }
        }
    },
    addRemoveBox:{
        borderRadius:'10px',
        position: 'absolute',
        margin:'10px 0 0 10px',
        '& button':{
            background:'white',
            '&:hover':{
                background:'#BABABA',
            }
        },
    },

    ////----CONFIRMAR PEDIDO----////

    confirmarPedidoContainer:{
        margin:'5rem 0',
        width: '30rem',
    },

    ////----ENTREGAR PEDIDO----////

    entregaContainer:{
        margin:'5rem 0',
    },

    ////----DETALLE PEDIDO----////

    detalleContainer:{
        margin:'5rem 0',
        width: '50rem'
    }
}))