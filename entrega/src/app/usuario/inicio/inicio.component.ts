import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../guards/account.service";
import {Usuario} from "../../modelo";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

   usurio:string;
   nameRol:string

  constructor(private accountService: AccountService) { }

  ngOnInit() {
      this.accountService.identity().then(account => {
          this.usurio = account.username;
          this.nameRol= account.rol.name;
      });
  }

}
