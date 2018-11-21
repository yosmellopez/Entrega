import {HttpHeaders, HttpResponseBase} from "@angular/common/http";

export class Provincia {
    id: number = null;
    codigo: number;
    nombre: string;

    constructor(value?: any) {
        if (value) {
            this.codigo = value.codigo ? value.codigo : "";
            this.nombre = value.nombre ? value.nombre : "";
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
    name: string;
    lastname: string;
    username: string;
    rol: Rol;
}

export class Rol {
    id: number;
    name: string;
}

export class ConsejoPopular {
    id: number;
    codigo: number;
    nombre: string;
    municipio: Municipio;
}

export class Persona {
    id: number;
    consejoPopular: ConsejoPopular;
    tipoPersona: string;
    ci: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    sexo: string;
    dirParticular: string;
    fechaNacimiento: Date;
    movil: string;
    telFijo: string;
    situacionLaboral: string;
    asociado: Persona;
}

export class Solicitud {
    id: number;
    tipoDecreto: string;
    tipoSolicitud: string;
    fechaSolicitud: Date;
    numExpediente: number;
    persona: Persona;
    parcelas: Parcela[];
    lineaProduccion: LineaDeProduccion[];
    areaSolicitada: number;
    tramite: Tramite;
    estado: string;
    fechaAproDes: Date;
}

export class Parcela {
    id: number;
    consejoPopular: ConsejoPopular;
    persona: Persona;
    zonaCatastral: number;
    parcela: number;
    divicion: number;
    tipoDeUso: TipoDeUso;
    area: number;
    limiteN: string;
    limiteS: string;
    limiteE: string;
    limiteW: string;
}

export class LineaDeProduccion {
    id: number;
    solicitud: Solicitud;
    lineaDeProduccion: string;
    areaDedicada: number;
    estudioSuelo: string;
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
    solicitud: Solicitud;
}

export class TipoDeSuperficie {
    id: number;
    codigo: number;
    nombre: string;
}

export class TipoDeUso {
    id: number;
    codigo: number;
    nombre: string;
    tipoDeSuperficie: TipoDeSuperficie;

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
