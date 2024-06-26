import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { CardContent } from '../models/CardContent';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve restaurants from API via GET', () => {
    const mockRestaurants: CardContent[] = [
      { id: 1, restaurant_id: 40356151, name: 'Restaurant 1', address: { building: '123', street: 'Main St', zipcode: '12345' }, cuisine: 'American' },
      { id: 2, restaurant_id: 40356152, name: 'Restaurant 2', address: { building: '456', street: 'Broad St', zipcode: '67890' }, cuisine: 'Italian' }
    ];

    service.getRestaurants().subscribe((restaurants: any) => {
      expect(restaurants.length).toBe(2);
      expect(restaurants).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/restaurants`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants);
  });

  it('should retrieve a restaurant by ID from API via GET', () => {
    const mockRestaurant: CardContent = { id: 1, restaurant_id: 40356151, name: 'Restaurant 1', address: { building: '123', street: 'Main St', zipcode: '12345' }, cuisine: 'American' };

    service.getRestaurant('1').subscribe(restaurant => {
      expect(restaurant).toEqual(mockRestaurant);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/restaurants/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurant);
  });

  it('should add a new restaurant via POST', () => {
    const newRestaurant: CardContent = { id: 3, restaurant_id: 40356153, name: 'New Restaurant', address: { building: '789', street: 'Oak St', zipcode: '54321' }, cuisine: 'Mexican' };

    service.addRestaurant(newRestaurant).subscribe(restaurant => {
      expect(restaurant).toEqual(newRestaurant);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/restaurants/`);
    expect(req.request.method).toBe('POST');
    req.flush(newRestaurant);
  });

  it('should update an existing restaurant via PUT', () => {
    const updatedRestaurant: CardContent = { id: 1, restaurant_id: 40356151, name: 'Updated Restaurant', address: { building: '123', street: 'Main St', zipcode: '12345' }, cuisine: 'American' };

    service.updateRestaurant(updatedRestaurant).subscribe(restaurant => {
      expect(restaurant).toEqual(updatedRestaurant);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/restaurants/${updatedRestaurant.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedRestaurant);
  });

});
