// Base class. GET species/ OR GET species/:id
export interface ISpecieDTO {
    id: string;
    name: string;
    description: string;
    ideal_values: JSON;
    imageUrl: string; // <- OR FILE.
}