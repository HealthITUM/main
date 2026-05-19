// Base class. GET species/ OR GET species/:id
export interface ISpecieDTO {
    id: number;
    name: string;
    description: string;
    ideal_values: Record<string, any>;
    imageUrl: string; // <- OR FILE.
}