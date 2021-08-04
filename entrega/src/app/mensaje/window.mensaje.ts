import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'confirm-mensaje',
    templateUrl: './confirm.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class Confirm {
    constructor(public dialogRef: MatDialogRef<Confirm>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    confirmar(confirm: boolean): void {
        this.dialogRef.close(confirm);
    }
}

@Component({
    selector: 'information-mensaje',
    templateUrl: './information.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class Information {
    constructor(public dialogRef: MatDialogRef<Information>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    cerrarDialog(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'error-mensaje',
    templateUrl: './error.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class MensajeError {
    constructor(public dialogRef: MatDialogRef<MensajeError>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    cerrarDialog(): void {
        this.dialogRef.close();
    }
}
