import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardContent } from '../models/CardContent';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  getRestaurants() {
    return this.httpClient.get(this.baseUrl + '/restaurants');
  }

  getRestaurant(id: string) {
    return this.httpClient.get(this.baseUrl + '/restaurants/' + id);
  }

  addRestaurant(restaurant: CardContent): Observable<CardContent> {
    return this.httpClient.post<CardContent>(this.baseUrl + '/restaurants/', restaurant);
  }

  updateRestaurant(restaurant: CardContent): Observable<CardContent> {
    return this.httpClient.put<CardContent>(this.baseUrl + '/restaurants/' + restaurant.id, restaurant);
  }

}