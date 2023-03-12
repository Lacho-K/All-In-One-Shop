import { HttpClient } from "@angular/common/http";
import { AppComponent } from "../app.component";
import { AuthService } from "../services/auth.service";
import { UserStoreService } from "../services/user-store.service";

export default class CheckUserRole{

    static checkUserRole(userStore: UserStoreService, auth: AuthService, http: HttpClient, ){
        userStore.getRoleFromStore().subscribe(role => {
            auth = new AuthService(http);
            let authRole = auth.isAdmin();
            AppComponent.IsAdmin = authRole || role == 'Admin';
        });
    }

}