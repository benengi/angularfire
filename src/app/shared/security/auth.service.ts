import { Injectable } from '@angular/core';
import { UserCredential } from '@firebase/auth-types';
import { AngularFireAuth } from 'angularfire2/auth';
import { from, Observable, BehaviorSubject, Subject } from 'rxjs';
import { AuthInfo } from './auth-info';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static UNKNOWN_USER = new AuthInfo(null);

  authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

  constructor(private auth: AngularFireAuth) { }

  login(email: string, password: string): Observable<UserCredential> {
    // Note: course code is wrong. Calling this.authInfo$.error() on a login error
    // causes the authInfo$ observable to complete and it won't respond to any
    // further login attempts.
    return from(this.auth.auth.signInWithEmailAndPassword(email, password)).pipe(
        tap(result => this.authInfo$.next(new AuthInfo(this.auth.auth.currentUser.uid))
      )
    );
  }

  signup(email: string, password: string): Observable<UserCredential> {
    return from(this.auth.auth.createUserWithEmailAndPassword(email, password)).pipe(
        tap(result => this.authInfo$.next(new AuthInfo(this.auth.auth.currentUser.uid))
      )
    );
  }

  logout() {
    this.auth.auth.signOut();
    this.authInfo$.next(AuthService.UNKNOWN_USER);
  }
}
