export interface IMeasurementCreateModel {
    internal_chip_id: string;
    values: Record<string, any>;
    timestamp: Date;
}