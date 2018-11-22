import { NgModule } from '@angular/core';
import { PrecioPipe } from './precio/precio';
import { TiempoDesdeAhoraPipe } from './tiempo-desde-ahora/tiempo-desde-ahora';
@NgModule({
	declarations: [PrecioPipe,
    TiempoDesdeAhoraPipe],
	imports: [],
	exports: [PrecioPipe,
    TiempoDesdeAhoraPipe]
})
export class PipesModule {}
