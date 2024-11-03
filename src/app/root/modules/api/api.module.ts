import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpService } from "./services/http.service";
import { ApiService } from "./services/api.service";

@NgModule({
    imports: [HttpClientModule],
    providers: [HttpService, ApiService]
})
export class ApiModule {}
