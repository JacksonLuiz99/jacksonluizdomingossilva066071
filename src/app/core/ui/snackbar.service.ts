import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: "root" })
export class SnackbarService {
  private snack = inject(MatSnackBar);

  success(message: string) {
    this.snack.open(message, "OK", {
      duration: 2500,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "snackbar-success",
    });
  }

  error(message: string) {
    this.snack.open(message, "Fechar", {
      duration: 4500,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "snackbar-error",
    });
  }
}
