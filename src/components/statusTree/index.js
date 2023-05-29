import Tree from "react-d3-tree"
import { useStyles } from "./statusTree.styles";

export const StatusTree = () => {

    /*
      <g 
        id="a19617b2-dd97-403c-8815-a494e546dcb7" 
        class="rd3t-node" 
        transform="translate(0,0)" 
        style="opacity: 1;"
      >
        <circle r="15"></circle>
        <g class="rd3t-label">
          <text class="rd3t-label__title" text-anchor="start" x="40">
            Recepcionado
          </text>
          <text class="rd3t-label__attributes">
            <tspan x="40" dy="1.2em">
              Fecha: 01-01-2023}
            </tspan>
          </text>
        </g>
      </g>
    */

    const rendererNode = (prop) => {

      let status = prop.nodeDatum.data.estado;

      return  <g>
        <circle r="15" className={classes[status]}/>
        <g class="rd3t-label">
          <text class="rd3t-label__title" text-anchor="start" x="40">
            {prop.nodeDatum.name}
          </text>
          <text class="rd3t-label__attributes">
            <tspan x="40" dy="1.2em">
              Fecha: {prop.nodeDatum.attributes.Fecha}
            </tspan>
          </text>
        </g>
      </g>

    }

    const formatStep = (step) => {
        const recursive = (data, index, final) => {
            if(index!==final){
                return {
                    name: data[index].nombre,
                    data: data[index],
                    attributes: {
                        Fecha: data[index].fecha_inicio
                    },
                    children:[recursive(data, index+1, final)]
                }
            }else{
                return {
                    name: data[index].nombre,
                    data: data[index],
                    attributes: {
                        Fecha: data[index].fecha_inicio
                    }
                }
            }
        }
        const final = recursive(step, 0, step.length-1);
        return final
    }

    const etapas = [
        {
          id:"1",
          nombre:"Recepcionado",
          fecha_inicio:"01-01-2023",
          estado:"finalizado"
        },
        {
          id:"2",
          nombre:"En cola",
          fecha_inicio:"01-01-2023",
          estado:"finalizado"
        },
        {
          id:"3",
          nombre:"En proceso",
          fecha_inicio:"01-01-2023",
          estado:"finalizado"
        },
        {
          id:"4",
          nombre:"Finalizado",
          fecha_inicio:"01-01-2023",
          estado:"finalizado"
        }
      ]

    const status = formatStep(etapas);
    const containerStyles = {
        width: '100%',
        height: '100%',
      };
    
      const nodeSize = {
        x: 60,
        y: 60,
      };

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Tree
                data={status}
                orientation="vertical"
                nodeSize={nodeSize}
                translate={{x:20,y:20}}
                renderCustomNodeElement={rendererNode}
            />
    </div>
    )
}