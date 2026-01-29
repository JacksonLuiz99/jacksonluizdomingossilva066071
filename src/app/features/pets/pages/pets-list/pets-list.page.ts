import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { map, Subject, takeUntil } from "rxjs";

import { PetsFacade } from "../../data-access/pets.facade";
import { TitleCasePipe } from "../../../../shared/components/ui/pipes/titlecase.pipe";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TitleCasePipe,
  ],
  templateUrl: "./pets-list.page.html",
  styleUrl: "./pets-list.page.scss",
})
export class PetsListPage implements OnInit, OnDestroy {
  facade = inject(PetsFacade);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl("");

  pageIndex$ = this.facade.page$.pipe(map((page) => page - 1));

  ngOnInit() {
    this.facade.loadPets().subscribe();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        this.facade.searchByName(query ?? "").subscribe();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent) {
    // Angular Material usa índice 0, mas nosso facade usa índice 1
    const newPage = event.pageIndex + 1;
    this.facade.goToPage(newPage).subscribe();
  }
}
