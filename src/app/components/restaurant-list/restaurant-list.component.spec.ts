import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RestaurantListComponent, DeleteDialog } from './restaurant-list.component';
import { DataService } from '../../services/data.service';
import { CardContent } from '../../models/CardContent';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RestaurantListComponent', () => {
  let component: RestaurantListComponent;
  let fixture: ComponentFixture<RestaurantListComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockRestaurants: CardContent[] = [
    {
      id: 1,
      restaurant_id: 40356151,
      name: 'Brunos On The Boulevard',
      address: {
        building: '8825',
        street: 'Astoria Boulevard',
        zipcode: '11369'
      },
      cuisine: 'American'
    },
    // Add more mock data as needed
  ];

  beforeEach(waitForAsync(() => {
    mockDataService = jasmine.createSpyObj('DataService', ['getRestaurants']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatDialogModule,
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: MatDialog, useValue: mockDialog },
        HttpClient
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch restaurants on initialization', () => {
    mockDataService.getRestaurants.and.returnValue(of(mockRestaurants));

    fixture.detectChanges();

    expect(component.cards.length).toBe(mockRestaurants.length);
    expect(component.cards).toEqual(mockRestaurants);
  });

  it('should navigate to detail view when openDetailView is called', () => {
    const routerSpy = spyOn(component.router, 'navigate').and.stub();

    const mockRestaurant: CardContent = mockRestaurants[0];
    component.openDetailView(mockRestaurant);

    expect(routerSpy).toHaveBeenCalledWith(['/detail', mockRestaurant.id]);
  });

  it('should open delete dialog when openDeleteDialog is called', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    const mockRestaurant: CardContent = mockRestaurants[0];
    component.openDeleteDialog(mockRestaurant);

    expect(mockDialog.open).toHaveBeenCalledWith(DeleteDialog);
  });

  it('should navigate to add view when addRestaurant is called', () => {
    const routerSpy = spyOn(component.router, 'navigate').and.stub();

    component.addRestaurant();

    expect(routerSpy).toHaveBeenCalledWith(['/add']);
  });

  it('should resize toolbar on scroll', () => {
    const toolbar: DebugElement = fixture.debugElement.query(By.css('.toolbar')); // Use the appropriate selector for the toolbar
    component.toolbar = { _elementRef: { nativeElement: toolbar.nativeElement } };

    window.scrollTo(0, 200);
    window.dispatchEvent(new Event('scroll'));

    fixture.detectChanges();

    expect(toolbar.nativeElement.style.fontSize).toBe('30px');
    expect(toolbar.nativeElement.style.height).toBe('50px');

    window.scrollTo(0, 100);
    window.dispatchEvent(new Event('scroll'));

    fixture.detectChanges();

    expect(toolbar.nativeElement.style.fontSize).toBe('90px');
    expect(toolbar.nativeElement.style.height).toBe('150px');
  });

  it('should delete restaurant and update list when delete is confirmed', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    const mockRestaurant: CardContent = mockRestaurants[0];
    component.cards.set(mockRestaurants);
    component.openDeleteDialog(mockRestaurant);

    expect(mockDialog.open).toHaveBeenCalledWith(DeleteDialog);
    expect(mockDataService.deleteRestaurant).toHaveBeenCalledWith(mockRestaurant.id);
    expect(component.cards().length).toBe(mockRestaurants.length - 1);
    expect(component.cards().find(card => card.id === mockRestaurant.id)).toBeUndefined();
  });
  // Add more tests as needed

});
