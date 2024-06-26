import { ChangeDetectionStrategy, Component, HostListener, ViewChild, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardContent } from '../../models/CardContent';

// type CardContent = {
//   id: number,
//   restaurant_id: number,
//   name: string;
//   address: {
//     building: string,
//     street: string,
//     zipcode: string
//   },
//   cuisine: string;
// };

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, MatToolbarModule],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.scss',
  providers: [DataService]
})
export class RestaurantListComponent {
  cards = signal<CardContent[]>([]);
  readonly dialog = inject(MatDialog);
  @ViewChild('toolbar') toolbar: any;

  constructor(public router: Router, private dataService: DataService) { }

  setCards(data: CardContent[]) {
    const cards: CardContent[] = [];
    for (let i = 0; i < data.length; i++) {
      cards.push(data[i]);
    }
    this.cards.set(cards);
  }

  ngOnInit() {
    this.dataService.getRestaurants().subscribe((resp: any) => {
      console.log("resp", resp);
      this.setCards(resp);
    })
  }

  @HostListener('window:scroll', ['$event']) 
  scrollHandler(event: Event) {
    console.debug("Scroll Event", event);
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      this.toolbar._elementRef.nativeElement.style.fontSize = "30px";
      this.toolbar._elementRef.nativeElement.style.height = "50px";
    } else {
      this.toolbar._elementRef.nativeElement.style.fontSize = "90px";
      this.toolbar._elementRef.nativeElement.style.height = "150px";
    }
  }

  openDetailView(item: CardContent) {
    console.log("redirect to details", item);
    this.router.navigate(['/detail', item.id]);
  }

  openDeleteDialog(item: CardContent) {
    const dialogRef = this.dialog.open(DeleteDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  addRestaurant() {
    console.log("addRestaurant");
    this.router.navigate(['/add']);
  }
}

@Component({
  selector: 'delete-dialog',
  template: `
    <h2 mat-dialog-title>Delete this restaurant</h2>
    <mat-dialog-content class="mat-typography">
      <p>Are you sure? We won't be able to recover the data afterwards.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
      <button mat-button [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialog {}