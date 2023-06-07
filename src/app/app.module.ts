import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {DecimalPipe} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG} from "ng2-currency-mask";
import {NgxMaskModule} from "ngx-mask";
import {ScullyLibModule} from '@scullyio/ng-lib'
import {Router, RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  allowNegative: false,
  decimal: ",",
  precision: 2,
  prefix: "R$",
  suffix: "",
  thousands: ".",
  align: 'left'
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Certifique-se de importar o RouterModule e defina as rotas apropriadas
    ScullyLibModule.forRoot(),
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatCardModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
