import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "";

                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMessage = `Client Error: ${error.error.message}`;
                } else {
                    // Server-side error
                    switch (error.status) {
                        case 400:
                            errorMessage = "Bad Request: The request was invalid.";
                            break;
                        case 401:
                            errorMessage = "Unauthorized: Authentication is required.";
                            // Optionally redirect to login page
                            // this.router.navigate(['/login']);
                            break;
                        case 403:
                            errorMessage = "Forbidden: You don't have permission to access this resource.";
                            break;
                        case 404:
                            errorMessage = "Not Found: The requested resource was not found.";
                            break;
                        case 500:
                            errorMessage = "Internal Server Error: Please try again later.";
                            break;
                        case 503:
                            errorMessage = "Service Unavailable: The server is temporarily unavailable.";
                            break;
                        default:
                            errorMessage = `Server Error ${error.status}: ${error.message}`;
                    }
                }

                // Log error to console in development
                console.error("HTTP Error:", {
                    status: error.status,
                    message: errorMessage,
                    url: error.url,
                    error: error.error
                });

                // Return user-friendly error
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}
