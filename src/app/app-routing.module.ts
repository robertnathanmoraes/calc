import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';



// @ts-ignore
// @ts-ignore
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },  {
    path: 'calculadora',
    loadChildren: () => import('./app.component').then(m => m.AppComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
// @ts-ignore
export class AppRoutingModule {
}
