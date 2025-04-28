import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      emailFormControl: ['', [Validators.required, Validators.email]],
      passwordFormControl: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get emailFormControl(): FormControl {
    return this.loginForm.get('emailFormControl') as FormControl;
  }

  get passwordFormControl(): FormControl {
    return this.loginForm.get('passwordFormControl') as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { emailFormControl, passwordFormControl } = this.loginForm.value;
      console.log('Login exitoso con:', emailFormControl, passwordFormControl);
    } else {
      console.log('Formulario inválido');
    }
  }
}
