import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainDoller(control: AbstractControl) {
  if (control.value.includes('$')) {
    return null;
  }
  return { invalid: true };
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@test.om') {
    return of(null);
  }

  return of({ invalid: true });
}

// let initEmail = '';
// const savedForm = window.localStorage.getItem('saved-login-form');
// if (savedForm) {
//   const loadedForm = JSON.parse(savedForm);
//   initEmail = loadedForm.email;
// }

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainDoller,
      ],
    }),
  });

  get formInvalid() {
    return (
      (this.form.controls.email.touched && this.form.controls.email.invalid) ||
      (this.form.controls.password.touched &&
        this.form.controls.password.invalid)
    );
  }

  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('saved-login-form');
    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      this.form.patchValue({ email: loadedForm.email });
    }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email }),
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    console.log(email, password);
  }
}
