import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./routing/app-routing.module";
import { AppComponentModule } from "./components/app-component.module";
import { HttpClientModule } from "@angular/common/http";
import { ApiService } from "./services/api.service";
import { HttpService } from "./services/http.service";

@NgModule({
    imports: [HttpClientModule, AppComponentModule, AppRoutingModule],
    providers: [HttpService, ApiService]
})
export class RootModule {}
