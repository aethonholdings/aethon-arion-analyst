import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./routing/app-routing.module";
import { AppComponentModule } from "./components/app-component.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiService } from "./services/api.service";
import { HttpService } from "./services/http.service";
import { ErrorInterceptor } from "./interceptors/error.interceptor";

@NgModule({
    imports: [HttpClientModule, AppComponentModule, AppRoutingModule],
    providers: [
        HttpService,
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class RootModule {}
