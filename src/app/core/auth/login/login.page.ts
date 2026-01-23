import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthFacade } from "../auth.facade";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.page.html",
  styleUrl: "./login.page.scss",
})
export class LoginPage {
  private fb = inject(FormBuilder);
  auth = inject(AuthFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;

    this.auth.login(username!, password!).subscribe((ok) => {
      if (ok) {
        // Pega URL salva ou redireciona para /pets por padrão
        const returnUrl =
          this.route.snapshot.queryParams["returnUrl"] || "/pets";
        console.log(" Login successful, redirecting to:", returnUrl);
        this.router.navigateByUrl(returnUrl);
      }
    });
  }
}
