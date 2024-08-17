import { NgModule } from "@angular/core";

import { ApiService } from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";
import { SpinnerModule } from "../spinner/spinner.module";

@NgModule({
    imports: [HttpClientModule, SpinnerModule],
    providers: [ApiService]
})
export class ApiModule {}
