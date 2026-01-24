import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-address-actions-sheet",
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <div class="sheet-container">
      <h3 class="sheet-title">Como deseja abrir este endereço?</h3>
      <p class="sheet-address">{{ data.address }}</p>

      <mat-nav-list>
        <a
          mat-list-item
          href="https://www.google.com/maps/search/?api=1&query={{
            encodedAddress
          }}"
          target="_blank"
          (click)="close()"
        >
          <mat-icon matListItemIcon class="google-maps-icon">map</mat-icon>
          <span matListItemTitle>Google Maps</span>
        </a>
        <a
          mat-list-item
          href="https://waze.com/ul?q={{ encodedAddress }}"
          target="_blank"
          (click)="close()"
        >
          <mat-icon matListItemIcon class="waze-icon">navigation</mat-icon>
          <span matListItemTitle>Waze</span>
        </a>
        <a
          mat-list-item
          href="https://m.uber.com/ul/?action=setPickup&client_id=YOUR_CLIENT_ID&pickup=my_location&dropoff[formatted_address]={{
            encodedAddress
          }}"
          target="_blank"
          (click)="close()"
        >
          <mat-icon matListItemIcon class="uber-icon">directions_car</mat-icon>
          <span matListItemTitle>Uber</span>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: [
    `
      .sheet-container {
        padding: 16px 0;
        background-color: white;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      .sheet-title {
        margin: 0 16px 8px 16px;
        font-size: 1.1rem;
        font-weight: 500;
      }
      .sheet-address {
        margin: 0 16px 16px 16px;
        color: #666;
        font-size: 0.9rem;
      }
      .google-maps-icon {
        color: #db4437;
      }
      .waze-icon {
        color: #33ccff;
      }
      .uber-icon {
        color: #000000;
      }
    `,
  ],
})
export class AddressActionsSheetComponent {
  encodedAddress: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { address: string },
    private _bottomSheetRef: MatBottomSheetRef<AddressActionsSheetComponent>,
  ) {
    this.encodedAddress = encodeURIComponent(data.address);
  }

  close(): void {
    this._bottomSheetRef.dismiss();
  }
}
