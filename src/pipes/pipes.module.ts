import { NgModule } from '@angular/core';
import { EstadoMesaPipe } from './estado-mesa/estado-mesa';
@NgModule({
	declarations: [EstadoMesaPipe],
	imports: [],
	exports: [EstadoMesaPipe]
})
export class PipesModule {}
