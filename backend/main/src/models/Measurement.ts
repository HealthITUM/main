export interface IMeasurementCreateModel {
    plantId: string;
    values: Record<string, any>;
    timestamp: Date;
}