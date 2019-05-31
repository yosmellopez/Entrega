import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { NativeDateAdapter } from '@angular/material';

export class Provincia {
    id: number = null;
    codigo: number;
    nombre: string;

    constructor(value?: any) {
        if (value) {
            this.codigo = value.codigo ? value.codigo : '';
            this.nombre = value.nombre ? value.nombre : '';
        }
    }
}

export class Municipio {
    id: number;
    codigo: number;
    nombre: string;
    provincia: Provincia;
}

export class Usuario {
    id: number;
    email: string;
    name: string;
    lastname: string;
    username: string;
    password: string;
    lastLogin: Date;
    rol: Rol;

    constructor(value?: any) {
        if (value) {
            this.name = value.name ? value.name : '';
            this.lastname = value.lastname ? value.lastname : '';
            this.username = value.username ? value.username : '';
            this.password = value.password ? value.password : '';
            this.rol = value.rol ? value.rol : ''
        }
    }
}

export class Rol {
    id: number;
    name: string;
}

export class Integracion {
    id: number;
    integracion: string;
}

export class ConsejoPopular {
    id: number;
    codigo: number;
    nombre: string;
    municipio: Municipio;
}

export class PersonaAyuda {
    id: number;
    ci: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    parentesco: string;
    asociado: Persona;
}

export class Persona {
    id: number;
    consejoPopular: ConsejoPopular;
    tipoPersona: string;
    ci: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    sexo: boolean = true;
    dirParticular: string;
    edad: number;
    movil: string;
    telFijo: string;
    situacionLaboral: string;
    integraciones: Integracion[] = [];
    estadoCivil: string;
    personaParcelas:PersonaParcelas[]=[];
    personasAyuda: PersonaAyuda[] = [];
    asociado: Persona;

    constructor(value?: any) {
        if (value) {
            this.ci = value ? value : ''
            this.tipoPersona = value ? value : '';
            //this.nombre = value.nombre ? value.nombre : "";
        }
    }
}

export class PersonaParcelas {
    parcela:Parcela;
    fechaAlta:Date;
    tipoDeTenencia:string;
    fechaBaja:Date;
    detallesBaja:string;
    gradoDeExplotacion:string;
    noCertTenInscrito:number;
    cultOActivAgroDediAct:string;
    areaVacia:number;
    existirCausas:string;
    personaParcelaPK:{parcelaId:number,personaId:number};
}

export class Solicitud {
    id: number;
    municipio: Municipio;
    tipoDecreto: string;
    tipoSolicitud: string;
    fechaSolicitud: Date;
    numExpediente: number;
    persona: Persona;
    parcelas: Parcela[];
    lineasDeProduccion: LineaDeProduccion[];
    areaSolicitada: number;
    tramite: Tramite;
    estado: string;
    aprobadoCAgraria:string;
    aprobadoPCC:string;
    detallesMT: string;
    detallesAproDesa: string;
}

export class Parcela {
    id: number = null;
    consejoPopular: ConsejoPopular;
    direccion: string;
    zonaCatastral: string;
    parcela: string;
    divicion: string;
    tipoUso: TipoUso;
    area: number;
    limiteN: string;
    limiteS: string;
    limiteE: string;
    limiteW: string;
    regulaciones: Regulacion[]=[];
    condicActual: string;
    parcelaBienhechurias:ParcelaBienhechuria[]=[];
}

export class ParcelaBienhechuria {
    bienhechuria:Bienhechuria;
    cantidad:number;
    precio:number;
}

export class LineaDeProduccion {
    id: number;
    solicitud: Solicitud;
    lineaDeProduccion: string;
    areaDedicada: number;
    aprobado:boolean;
    estudioSuelo: string;
}

export class Bienhechuria {
    id: number;
    nombre: string;
}

export class Regulacion {
    id: number;
    regulacion: string;

    constructor(id: number, regulacion: string){
        this.id = id;
        this.regulacion = regulacion;
    }
}

export class Tramite {
    id: number;
    fechaConcilONHG: Date;
    fechaEntreMedicion: Date;
    fechaConcInstSuelo: Date;
    fechaEntregaEstudioSuelo: Date;
    fechaConcPlanFis: Date;
    fechaEntregaRegulaciones: Date;
    fechaConcEmpAgric: Date;
    fechaEntregValoBienchurías: Date;
    fechaAprobadoCAgraria: Date;
    fechaAprobadoPCC: Date;
    solicitud: Solicitud;
}

export class TipoSuperficie {
    id: number;
    codigo: number;
    nombre: string;
}

export class TipoUso {
    id: number;
    codigo: number;
    nombre: string;
    tipoSuperficie: TipoSuperficie;

}

export class AppResponse<T> {
    success: boolean;
    msg: string;
    elemento?: T;
    elementos?: T[];
    total: number;
}

export declare class Respuesta<T> extends HttpResponseBase {
    body: AppResponse<T>;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    url: string;
}

export declare interface RouteInfo {
    id: string;
    path: string;
    title: string;
    icon: string;
    class: string;
    authority: string[];
    routes: AppRoute[];
    hasChildren: boolean;
}

export declare interface AppRoute {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export class DateFormat extends NativeDateAdapter {
    useUtcForDisplay = true;

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}


