import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RestaurantFormComponent } from './restaurant-form.component';
import { DataService } from '../../services/data.service';
import { CardContent } from '../../models/CardContent';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { HttpClient } from '@angular/common/http'; // Import HttpClient


class MockDataService {
  getRestaurant(id: string) {
    return of({
      restaurant_id: '1',
      name: 'Test Restaurant',
      address: {
        building: '123',
        street: 'Test Street',
        zipcode: '12345'
      },
      cuisine: 'Test Cuisine'
    });
  }

  updateRestaurant(restaurant: CardContent) {
    return of(restaurant);
  }

  addRestaurant(restaurant: CardContent) {
    return of(restaurant);
  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RestaurantFormComponent', () => {
  let component: RestaurantFormComponent;
  let fixture: ComponentFixture<RestaurantFormComponent>;
  let dataService: DataService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
        HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantFormComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.restaurantForm).toBeDefined();
    expect(component.restaurantForm.controls['restaurant_id']).toBeTruthy();
    expect(component.restaurantForm.controls['name']).toBeTruthy();
    expect(component.restaurantForm.controls['address']).toBeTruthy();
    expect(component.restaurantForm.controls['cuisine']).toBeTruthy();
  });

  it('should set isEdit to true and patch form value if id is present', fakeAsync(() => {
    component.id = '1';
    component.ngOnInit();
    tick();
    expect(component.isEdit).toBeTrue();
    expect(component.restaurantForm.value).toEqual({
      restaurant_id: '1',
      name: 'Test Restaurant',
      address: {
        building: '123',
        street: 'Test Street',
        zipcode: '12345'
      },
      cuisine: 'Test Cuisine'
    });
  }));

  it('should call addRestaurant on submit when form is valid and isEdit is false', fakeAsync(() => {
    component.id = '';
    component.restaurantForm.setValue({
      restaurant_id: '1',
      name: 'New Restaurant',
      address: {
        building: '123',
        street: 'New Street',
        zipcode: '12345'
      },
      cuisine: 'New Cuisine'
    });

    spyOn(dataService, 'addRestaurant').and.callThrough();
    component.onSubmit();
    tick();
    expect(dataService.addRestaurant).toHaveBeenCalledWith({
      id: 1,
      restaurant_id: 1,
      name: 'New Restaurant',
      address: {
        building: '123',
        street: 'New Street',
        zipcode: '12345'
      },
      cuisine: 'New Cuisine'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
  }));

  it('should call updateRestaurant on submit when form is valid and isEdit is true', fakeAsync(() => {
    component.id = '1';
    component.ngOnInit();
    tick();
    component.restaurantForm.setValue({
      restaurant_id: '1',
      name: 'Updated Restaurant',
      address: {
        building: '123',
        street: 'Updated Street',
        zipcode: '12345'
      },
      cuisine: 'Updated Cuisine'
    });

    spyOn(dataService, 'updateRestaurant').and.callThrough();
    component.onSubmit();
    tick();
    expect(dataService.updateRestaurant).toHaveBeenCalledWith({
      id: 1,
      restaurant_id: 1,
      name: 'Updated Restaurant',
      address: {
        building: '123',
        street: 'Updated Street',
        zipcode: '12345'
      },
      cuisine: 'Updated Cuisine'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
  }));

  it('should not submit when form is invalid', () => {
    spyOn(dataService, 'addRestaurant');
    spyOn(dataService, 'updateRestaurant');
    component.restaurantForm.controls['restaurant_id'].setValue('');
    component.onSubmit();
    expect(dataService.addRestaurant).not.toHaveBeenCalled();
    expect(dataService.updateRestaurant).not.toHaveBeenCalled();
    expect(component.restaurantForm.valid).toBeFalse();
  });

  it('should navigate back to list on goBack', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('should handle error on addRestaurant', fakeAsync(() => {
    component.id = '';
    component.restaurantForm.setValue({
      restaurant_id: '1',
      name: 'New Restaurant',
      address: {
        building: '123',
        street: 'New Street',
        zipcode: '12345'
      },
      cuisine: 'New Cuisine'
    });

    spyOn(dataService, 'addRestaurant').and.returnValue(throwError(() => new Error('Error adding restaurant')));
    spyOn(console, 'error');
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error adding restaurant:', jasmine.any(Error));
  }));

  it('should handle error on updateRestaurant', fakeAsync(() => {
    component.id = '1';
    component.ngOnInit();
    tick();
    component.restaurantForm.setValue({
      restaurant_id: '1',
      name: 'Updated Restaurant',
      address: {
        building: '123',
        street: 'Updated Street',
        zipcode: '12345'
      },
      cuisine: 'Updated Cuisine'
    });

    spyOn(dataService, 'updateRestaurant').and.returnValue(throwError(() => new Error('Error updating restaurant')));
    spyOn(console, 'error');
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Error updating restaurant:', jasmine.any(Error));
  }));
});
