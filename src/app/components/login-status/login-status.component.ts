import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFirstAndLast: string;

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth ) { }

  ngOnInit(): void {

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserName();
      }
    )
  }
  getUserName() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then(
        (result) => {
          // oktaAuth getUser() returns result obj.[name (FirstAndLast)concat'd]
          this.userFirstAndLast = result.name;

          // oktaAuth returns result obj.[customer email]
          const theEmail = result.email;

          // set email in browser session storage
          //                      key           (stringifed)value
          //                       |                          |
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    // ends Okta sessoion
    this.oktaAuth.signOut();
  }

}
