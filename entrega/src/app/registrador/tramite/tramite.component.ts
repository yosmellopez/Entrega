import { Component, OnInit } from '@angular/core';
import {TramiteService} from "../../servicios/tramite.service";

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.css']
})
export class TramiteComponent implements OnInit {

  constructor(private sevice:TramiteService) { }

  ngOnInit() {
      this.sevice.listarSolicitudInvest().subscribe(value => {
          if (value.body.success){
              console.log(value.body.elementos);
          }else {
              console.log(value.body.msg);
          }
      })
  }

}
