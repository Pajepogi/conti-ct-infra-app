import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
	constructor() {
	}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(catchError(err => {
			if (err.status === 401 || err.status === 404) {
				alert(err.status + ' unauthorized or Bad request or response');
			}

			if(err.status == 500){
				alert(err.status + ' Please contact administrator.');
			}

			if (err.status >= 502 && err.status <= 504) {
				alert(err.status + ' Service unavailable - Internal server error');
			}

			return throwError(err.statusText);
		}));
	}
}