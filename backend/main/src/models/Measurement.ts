export interface IMeasurementCreateModel {
    plantId: number;
    values: Record<string, any>;
    timestamp: Date;
}