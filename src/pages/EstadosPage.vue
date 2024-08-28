<template>
    <div>
        <q-card class="q-ma-md q-pa-md" elevation="13">
            <h3> <q-icon name="change_circle" /> Mantendor de Estados</h3>
            Descripción del mantenedor de estados<br><br>
            <q-btn color="primary" class="glossy" icon="add" @click="dialogEstado = true">Agregar</q-btn>
            <div class=" q-mt-md">
                <q-table bordered title="Estados" :rows="estados" :columns="columns" :rows-per-page-options="[10]"
                    :filter="filter">
                    <template v-slot:body-cell-enabledopt="props">
                        <q-td :props="props" align="center">
                            <q-icon :name="props.row.estado ? 'check_circle' : 'cancel'"
                                :color="props.row.estado ? 'green' : 'red'" />
                        </q-td>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <q-btn color="primary" icon="edit" @click="editarEstado(props.row)" flat />
                            <q-btn color="red" icon="delete" @click="eliminarEstado(props.row)" flat />
                        </q-td>
                    </template>
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                </q-table>
            </div>
        </q-card>
        <!-- DIALOGO CREAR EMPRESA  -->
        <q-dialog v-model="dialogEstado" persistent>
            <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
                <q-card-section class="row items-center">
                    <q-avatar square icon="domain" color="primary" text-color="white" />
                    <span class="q-ml-sm">Agregar Nuevo Estado</span>
                </q-card-section>
                <q-card-section>
                    <q-option-group v-model="group" :options="options" color="primary" inline />
                </q-card-section>
                <q-card-section>
                    <q-input v-model="estado.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
                    <q-input v-model="estado.descripcion" label="Descripción" stack-label dense lazy-rules
                        color="primary" />
                    <q-input v-model="estado.codigo" label="Codigo" stack-label dense lazy-rules color="primary" />
                    <q-select v-if="group == 1" dense v-model="estado.empresaId" :options="empresas" label="Empresa"
                        map-options emit-value />
                </q-card-section>
                <q-card-actions align="right">
                    <template v-if="!cargandoIcon">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogEstado = false" />
                        <q-btn label="Confirmar" color="primary" @click="crearEstado()" />
                    </template>
                    <template v-if="cargandoIcon">
                        <span color="primary">Registrando...</span>
                        <q-spinner-hourglass color="primary" size="2em" />
                    </template>
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- DIALOGO EDITAR ESTADO -->
        <q-dialog v-model="dialogEstadoEdit" persistent>
            <q-card class="q-gutter-sm my-card" style="width: 700px; max-width: 80vw">
                <q-card-section class="row items-center">
                    <q-avatar square icon="domain" color="primary" text-color="white" />
                    <span class="q-ml-sm">Modificar la Estado</span>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="estado.nombre" label="Nombre" lazy-rules stack-label dense color="primary" />
                    <q-input v-model="estado.descripcion" label="Descripción" stack-label dense lazy-rules
                        color="primary" />
                    <q-input v-model="estado.codigo" label="Codigo" stack-label dense lazy-rules color="primary" />
                    <q-select dense v-model="estado.empresaId" :options="empresas" label="Empresa" map-options
                        emit-value />
                </q-card-section>
                <q-card-actions align="right">
                    <template v-if="!cargandoIcon">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup @click="dialogEstadoEdit = false" />
                        <q-btn label="Confirmar" color="primary" @click="actualizarEstado()" />
                    </template>
                    <template v-if="cargandoIcon">
                        <span color="primary">Registrando...</span>
                        <q-spinner-hourglass color="primary" size="2em" />
                    </template>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { useUsuariostore } from "src/stores/usuario.store";

export default {

    data() {
        return {
            filter: "",
            dialogEstado: false,
            cargandoIcon: false,
            dialogEstadoEdit: false,
            estados: [],
            paises: [],
            cuentas: [],
            empresas: [],
            estado: {
                nombre: null,
                descripcion: null,
                codigo: null,
                estado: true,
                empresaId: null,
                areaId: null,
            },
            columns: [
                {
                    name: "nombre",
                    required: true,
                    label: "Nombre",
                    align: "left",
                    field: (row) => row.nombre,
                    format: (val) => `${val}`,
                    classes: "",
                    headerClasses: "bg-primary text-white glossy",
                    style: "max-width: 150px",
                },
                {
                    name: "email",
                    label: "Correo",
                    field: "email",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                },
                {
                    name: "direccion",
                    label: "Dirección",
                    field: "direccion",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                },
                {
                    name: "Empresa",
                    label: "Empresa",
                    field: row => row.cuentaEmpresa ? row.cuentaEmpresa.nombre : "Sin Empresa",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                },
                {
                    name: "País",
                    label: "País",
                    field: row => row.pais ? row.pais.nombre : "Sin País",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                },
                {
                    name: "enabledopt",
                    label: "Estado",
                    field: "estado",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                    format: (val) => val
                        ? '<q-icon name="check_circle" color="green" />'
                        : '<q-icon name="cancel" color="red" />',
                },
                {
                    name: "actions",
                    label: "Acciones",
                    field: "actions",
                    align: "center",
                    headerClasses: "bg-primary text-white glossy",
                },
            ],
            pagination: {
                page: 1, // Página inicial
                rowsPerPage: 10, // Filas por página
            },
            empresaId: null,
            options: [
                { label: "Area", value: 2 },
                { label: "Empresa", value: 1 }
            ],
            group: null,
        }
    },
    created() {
        const usuarioStore = useUsuariostore();
        this.cuentaId = usuarioStore.cuentaId;
        this.empresaId = usuarioStore.empresa;
        this.obtenerEstados();
    },
    watch: {
        dialogEstado() {
            if (this.dialogEstado == true) {
                let auxiliar = {
                    nombre: null,
                    descripcion: null,
                    codigo: null,
                    estado: true,
                    empresaId: null,
                    areaId: null,
                }
                this.obtenerEmpresa()
                this.estado = auxiliar
            } else {
                this.obtenerEstados()
            }
        },
        dialogEstadoEdit() {
            if (this.dialogEstadoEdit == false) {
                this.obtenerEstados()
            }
        }
    },
    methods: {
        async obtenerEstados() {
            this.estados = [];
            const response = await api.get("/estados");
            this.estados = response.data
            console.log(response.data)
        },
        async crearEstado() {
            const response = await api.post("/estados", this.estado)
            console.log(response)
            this.dialogEstado = false;
        },
        editarEstado(row) {
            this.dialogEstadoEdit = true;
            console.log(row)
            this.estado = row;
        },
        async obtenerEmpresa() {
            const response = await api.get("/empresa/" + this.empresaId)
            this.empresas = [{ value: response.data.id, label: response.data.nombre }]
            console.log(this.empresas)
        },
        async actualizarEstado() {
            let id = this.estado.id
            delete this.estado.id
            const response = await api.patch("/estados/" + id, this.estado)
            console.log(response)
            this.dialogEstadoEdit = false;
        },
        eliminarEstado(row) {
            Notify.create({
                timeout: 0, // mantener la notificación hasta que haga una acción
                message: "¿ Desea eliminar el estado " + row.nombre + " ? ",
                actions: [
                    {
                        label: "Eliminar",
                        color: "red",
                        handler: async () => {
                            try {
                                const response = await api.delete("/estados/" + row.id)
                                this.obtenerEstados();
                                // console.log(response)
                            } catch (error) {
                                console.error("Error al eliminar el Estado:", error);
                            }
                        },
                    },
                    {
                        label: "Cancelar",
                        handler: async () => {
                            console.log("Eliminación cancelada");
                        },
                    },
                ],
            });
        }
    }
}
</script>