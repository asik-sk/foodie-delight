import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CardContent } from '../../models/CardContent';

@Component({
  selector: 'app-restaurant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.scss'
})
export class RestaurantFormComponent {
  @Input() restaurant: any;
  @Input() id = '';
  restaurantForm: FormGroup;
  isEdit: boolean = false;

  constructor(private dataService: DataService, private router: Router, private fb: FormBuilder) {
    this.restaurantForm = this.fb.group({
      restaurant_id: ['', Validators.required],
      name: ['', Validators.required],
      address: this.fb.group({
        building: ['', Validators.required],
        street: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      cuisine: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.id) {
      this.isEdit = true;
      this.dataService.getRestaurant(this.id).subscribe((resp: any) => {
        this.restaurantForm.patchValue(resp);
      })
    }
  }

  onSubmit() {
    if (this.restaurantForm.valid) {
      const formValues = this.restaurantForm.value;
      const restaurantData: CardContent = {
        id: formValues.restaurant_id, // Use existing id if available, else set to 0 for new
        ...formValues
      };

      if (this.isEdit) {
        this.dataService.updateRestaurant(restaurantData).subscribe({
          next: (updatedRestaurant) => {
            console.log('Updated restaurant:', updatedRestaurant);
            this.router.navigate(['/list']);
          },
          error: (err) => {
            console.error('Error updating restaurant:', err);
          }
        });
      } else {
        this.dataService.addRestaurant(restaurantData).subscribe({
          next: (newRestaurant) => {
            console.log('New restaurant added:', newRestaurant);
            this.router.navigate(['/list']);
          },
          error: (err) => {
            console.error('Error adding restaurant:', err);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  goBack() {    
    this.router.navigate(['/list']);
  }
}
