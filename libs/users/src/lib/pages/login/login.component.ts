import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
    loginFormGroup!: FormGroup;
    isSubmitted = false;
    authError = false;
    authMessage = 'Inavlid Email/Password!';
    endSub$: Subject<any> = new Subject();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private localstorageService: LocalstorageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._initLoginForm();
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }

    private _initLoginForm() {
        this.loginFormGroup = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.loginFormGroup.invalid) return;

        const loginData = {
            email: this.loginForm['email'].value,
            password: this.loginForm['password'].value
        };

        this.authService
            .login(loginData.email, loginData.password)
            .pipe(takeUntil(this.endSub$))
            .subscribe(
                (user) => {
                    this.authError = false;
                    if (user.token)
                        this.localstorageService.setToken(user.token);
                    this.router.navigate(['/']);
                },
                (error: HttpErrorResponse) => {
                    this.authError = true;
                    console.log(error);
                    if (error.status !== 400) {
                        this.authMessage =
                            'Something went wrong! Please try again later!';
                    }
                }
            );
    }

    get loginForm() {
        return this.loginFormGroup.controls;
    }
}
