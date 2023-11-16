import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { Root } from '../pages';
import { Admin } from '../pages/admin';
import { Backup } from '../pages/admin/backup';
import { Binnacle } from '../pages/admin/bitacora/bitacora';
import { Configuracion } from '../pages/admin/backup/configuracion';
import { MaterialesAdmin } from '../pages/admin/materiales';
import { CreateMaterial } from '../pages/admin/materiales/createMaterial';
import { DetailsMaterialAdmin } from '../pages/admin/materiales/detailsMaterial';
import { TrabajosAdmin } from '../pages/admin/trabajos';
import { CreateJob } from '../pages/admin/trabajos/createJob';
import { DetailsJobAdmin } from '../pages/admin/trabajos/detailsJob';
import { Usuarios } from '../pages/admin/usuarios';
import { CreateUser } from '../pages/admin/usuarios/createUser';
import { DetailsClient } from '../pages/admin/usuarios/detailsClient';
import { Area } from '../pages/area';
import { EquipmentArea } from '../pages/area/equipamiento';
import { CreateEquipment } from '../pages/area/equipamiento/createEquipment';
import { DetailsEquipment } from '../pages/area/equipamiento/detailsEquipment';
import { MaterialArea } from '../pages/area/materiales';
import { DetailsMaterialArea } from '../pages/area/materiales/detailsMaterialArea';
import { ReporteArea } from '../pages/area/reportes/ReporteArea';
import { ReporteMaterial } from '../pages/area/reportes/ReporteMaterial';
import { ReportePedidos } from '../pages/area/reportes/ReportePedidos';
import { Trabajos } from '../pages/area/trabajos';
import { Cronograma } from '../pages/area/trabajos/Cronograma';
import { DetalleTrabajo } from '../pages/area/trabajos/DetalleTrabajo';
import { Finalizar } from '../pages/area/trabajos/Finalizar';
import { Cliente } from '../pages/cliente';
import { PedidosCliente } from '../pages/cliente/pedidos';
import { SolicitarCliente } from '../pages/cliente/pedidos/solicitar';
import { Login } from '../pages/login';
import { Recepcion } from '../pages/Recepcion';
import { ClientesRecepcion } from '../pages/Recepcion/clientes';
import { CreateClientRecepcion } from '../pages/Recepcion/clientes/crear';
import { DetailsClientRecepcion } from '../pages/Recepcion/clientes/details';
import { Materiales } from '../pages/Recepcion/Materiales';
import { Recepcionar } from '../pages/Recepcion/Materiales/recepcionar';
import { Solicitar } from '../pages/Recepcion/Materiales/solicitar';
import { Pedidos } from '../pages/Recepcion/Pedidos';
import { Confirmar } from '../pages/Recepcion/Pedidos/Confirmar';
import { Crear } from '../pages/Recepcion/Pedidos/Crear';
import { Details } from '../pages/Recepcion/Pedidos/Details';
import { Entregar } from '../pages/Recepcion/Pedidos/Entregar';
import { BinnacleDetail } from '../pages/admin/bitacora/details';
import { ReporteBitacora } from '../pages/admin/reportes/reporteBitacora';
import { Cuentas } from '../pages/admin/usuarios/indexAccount';
import { AccountDetails } from '../pages/admin/usuarios/accountDetails';
import { ConfirmOrder } from '../pages/Recepcion/Materiales/confirmOrder';
import { ConfigWhatsapp } from '../pages/admin/mensajeria/configWhats';
import { Direccion } from '../pages/direccion';
import { ConfigEmail } from '../pages/admin/mensajeria/configEmail';
import { decodeToken } from 'react-jwt';
import { Cargos } from '../pages/admin/cargos';
import { ConfigBinnacle } from '../pages/admin/bitacora/config';



export const routes = createBrowserRouter(createRoutesFromElements(
    
    <Route path='' element={<Root/>}>
        <Route path='/login' element={<Login />}/>
        <Route path='/cliente' element={<Cliente/>}>
            <Route path='pedidos' element={<PedidosCliente/>}/>
            <Route path='pedidos/:id' element={<Details/>}/>
            <Route path='pedidos/nuevo' element={<SolicitarCliente/>}/>
        </Route>
        <Route path='/direccion' element={<Direccion/>}>
            <Route path='reporteMaterial' element={<ReporteMaterial/>}/>
            <Route path='cronograma' element={<Cronograma direction={true}/>}/>

        </Route>
        <Route path='/recepcion' element={<Recepcion/>}>
            <Route path='clientes' element={<ClientesRecepcion/>}/>
            <Route path='clientes/:id' element={<DetailsClientRecepcion/>}/>
            <Route path='clientes/crear' element={<CreateClientRecepcion/>}/>
            <Route path='pedidos' element={<Pedidos/>}/>
            <Route path='pedidos/:id' element={<Details/>}/>
            <Route path='pedidos/nuevo' element={<Crear/>}/>
            <Route path='pedidos/confirmar' element={<Confirmar/>}/>
            <Route path='pedidos/entrega' element={<Entregar/>}/>
            <Route path='material' element={<Materiales/>}/>
            <Route path='material/solicitar' element={<Solicitar/>}/>
            <Route path='material/recepcionar' element={<Recepcionar/>}/>
            <Route path='material/recepcionar/:id' element={<ConfirmOrder/>}/>
        </Route>
        <Route path='/area' element={<Area/>}>
            <Route path='trabajos' element={<Trabajos/>}/>
            <Route path='trabajos/:id' element={<DetalleTrabajo/>}/>
            <Route path='trabajos/cronograma' element={<Cronograma direction={false}/>}/>
            <Route path='trabajos/finalizar/:id' element={<Finalizar/>}/>
            <Route path='material' element={<MaterialArea/>}/>
            <Route path='material/:id' element={<DetailsMaterialArea/>}/>
            <Route path='equipamiento' element={<EquipmentArea/>}/>
            <Route path='equipamiento/crear' element={<CreateEquipment/>}/>
            <Route path='equipamiento/:id' element={<DetailsEquipment/>}/>
            <Route path='reporteArea' element={<ReporteArea/>}/>
            <Route path='reporteMaterial' element={<ReporteMaterial/>}/>
            <Route path='reportePedidos' element={<ReportePedidos/>}/>
        </Route>
        <Route path='/admin' element={<Admin/>}>
            <Route path='cargos' element={<Cargos/>}/>
            <Route path='configWhatsapp' element={<ConfigWhatsapp/>}/>
            <Route path='configEmail' element={<ConfigEmail/>}/>
            <Route path='cuentaUsuarios' element={<Cuentas/>}/>
            <Route path='cuentaUsuarios/:id' element={<AccountDetails/>}/>
            <Route path='usuarios' element={<Usuarios/>}/>
            <Route path='usuarios/:id' element={<DetailsClient/>}/>
            <Route path='usuarios/crear' element={<CreateUser/>}/>
            <Route path='materiales' element={<MaterialesAdmin/>}/>
            <Route path='materiales/:id' element={<DetailsMaterialAdmin/>}/>
            <Route path='materiales/crear' element={<CreateMaterial/>}/>
            <Route path='trabajos' element={<TrabajosAdmin/>}/>
            <Route path='trabajos/:id' element={<DetailsJobAdmin/>}/>
            <Route path='trabajos/crear' element={<CreateJob/>}/>
            <Route path='backup' element={<Backup/>}/>
            <Route path='backup/configurar' element={<Configuracion/>}/>
            <Route path='bitacora' element={<Binnacle/>}/>
            <Route path='bitacora/configBinnacle' element={<ConfigBinnacle/>}/>
            <Route path='bitacora/detail/:id' element={<BinnacleDetail/>}/>
            <Route path='reporteBitacora' element={<ReporteBitacora/>}/>
        </Route>
    </Route>
))