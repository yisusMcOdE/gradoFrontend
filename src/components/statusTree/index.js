import { Grid, Popover, TextField } from "@mui/material";
import { useState } from "react";
import Tree from "react-d3-tree"
import { formatStatus } from "../../utilities/formatStatusTree";
import { useStyles } from "./statusTree.styles";

export const StatusTree = ({steps}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [element, setElement] = useState();
    const [position, setPosition] = useState({x:20,y:20});

    const typesSpanish = {
      registered: 'Registrado',
      confirmation: 'Confirmado',
      scheduled: 'Agendado',
      delayed: 'Retrasado',
      develop: 'Desarrollando',
      resumed: 'Reanudado',
      finished: 'Finalizado'
    }

    const handleClick = (event,item) => {
      setElement(item);
      setAnchorEl(event.target);
      console.log(event);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    


    const rendererNode = (prop) => {

      const id = open ? `popOver-${prop.nodeDatum.data._id.slice(-7)}` : undefined;

      let status = prop.nodeDatum.data.finishedAt?'finalizado':'ejecucion';
      status = prop.nodeDatum.data.type==='delayed'?'retraso':status;

      return  <g>
        <circle
          aria-describedby={id}
          r="15" 
          className={`${classes[status]} ${classes.circle}`}
          onClick={e=>{handleClick(e,prop.nodeDatum.data)}}
        />
        <g 
          class="rd3t-label" 
          aria-describedby={id} 
          onClick={e=>{handleClick(e,prop.nodeDatum.data)}}
        >
          <text class="rd3t-label__title" text-anchor="start" x="40">
            {typesSpanish[prop.nodeDatum.name]}
          </text>
          <text class="rd3t-label__attributes">
            <tspan x="40" dy="1.2em">
              {prop.nodeDatum.attributes.Fecha}
            </tspan>
          </text>
        </g>
      </g>

    }

    const formatStep = (step) => {
        const recursive = (data, index, final) => {
            if(index!==final){
                return {
                    name: data[index].type,
                    data: data[index],
                    attributes: {
                        Fecha: data[index].finishedAt?.slice(0,10) || 'en progreso'
                    },
                    children:[recursive(data, index+1, final)]
                }
            }else{
                return {
                    name: data[index].type,
                    data: data[index],
                    attributes: {
                        Fecha: data[index].finishedAt?.slice(0,10) || 'en progreso'
                    }
                }
            }
        }
        const final = recursive(step, 0, step.length-1);
        return final
    }

    const status = formatStep(steps);
    
    const nodeSize = {
      x: 60,
      y: 60,
    };

    const classes = useStyles();

    const handlePosition = (deltaY) => {
      let newPosition = {}
      if(deltaY>0){
        newPosition = {...position, y:position.y-7}
      }else{
        newPosition = {...position, y:position.y+7}
      }
      setPosition(newPosition);
    }

    return (
        <div className={classes.container}>
            <div className={classes.treeContainer} onWheel={({deltaY})=>{handlePosition(deltaY)}}>
              <Tree
                  draggable={false}
                  zoomable={false}
                  data={status}
                  orientation="vertical"
                  nodeSize={nodeSize}
                  translate={position}
                  renderCustomNodeElement={rendererNode}
                  
              />
            </div>
            {element&&
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
            <Grid container direction='column' rowSpacing={2} className={classes.popOver}>
              <Grid item>
                <label className={classes.titlePage}>Detalle de Estado</label>
              </Grid>
              <Grid item container direction='column' rowSpacing={1}>
                <Grid item container columnGap={3} alignItems='center'>
                  <Grid item xs={2}>
                    <label>Tipo:</label>
                  </Grid>
                  <Grid item xs>
                    <TextField 
                      disabled
                      variant="standard" 
                      className="input" 
                      size="small"
                      value={typesSpanish[element.type]}
                    />
                  </Grid>
                </Grid>
                <Grid item container columnGap={3} alignItems='center'>
                  <Grid item xs={2}>
                    <label>Inicio:</label>
                  </Grid>
                  <Grid item xs>
                    <TextField 
                      disabled
                      variant="standard" 
                      className="input" 
                      size="small"
                      value={
                        `${element.createdAt.slice(0,10)} - ${element.createdAt.slice(11,19)}`
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item container columnGap={3} alignItems='center'>
                  <Grid item xs={2}>
                    <label>Fin:</label>
                  </Grid>
                  <Grid item xs>
                    <TextField 
                      disabled
                      variant="standard" 
                      className="input" 
                      size="small"
                      value={
                        element.finishedAt?`${element.finishedAt.slice(0,10)} - ${element.finishedAt.slice(11,19)}`:'----------'
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item container columnGap={2}>
                  <Grid item xs>
                    <TextField 
                      multiline
                      disabled
                      style={{width:'13rem', 
                      margin:'auto', 
                      display:'block'}}
                      value={element.description}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Popover>}
    </div>
    )
}