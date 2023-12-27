import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
	constructor(private authorizeService: AuthorizationService) {
	}

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		var authToken = sessionStorage.getItem("AuthToken");
		if(!authToken)
		{
			console.log("Authentication token is null");
			//Add logic to show popup for unauthorized access
		}
		
		if (authToken) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${authToken}`
				}
			});
		}

		return next.handle(request);
	}
}