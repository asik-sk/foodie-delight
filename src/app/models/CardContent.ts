export interface CardContent {
    id: number;
    restaurant_id: number;
    name: string;
    address: {
        building: string;
        street: string;
        zipcode: string;
    };
    cuisine: string;
}
