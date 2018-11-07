import { NgModule } from '@angular/core';
import { EstadoMesaPipe } from './estado-mesa/estado-mesa';
import { PrecioPipe } from './precio/precio';
@NgModule({
	declarations: [EstadoMesaPipe,
    PrecioPipe],
	imports: [],
	exports: [EstadoMesaPipe,
    PrecioPipe]
})
export class PipesModule {}
