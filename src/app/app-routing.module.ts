import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { PlayersTableComponent } from './components/players-table/players-table.component';
import { AppComponent } from './app.component';
const routes: Routes = [
  {path: '',component:TableComponent},
  {path: 'players',component:PlayersTableComponent},
  {path: 'teams',component:TableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
