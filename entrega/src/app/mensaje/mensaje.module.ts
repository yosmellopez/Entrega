import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AngularMaterialModule} from "../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {Confirm, Information, MensajeError} from "./window.mensaje";

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [Information, MensajeError, Confirm],
    entryComponents: [Information, MensajeError, Confirm]
})
export class MensajeModule {
}
