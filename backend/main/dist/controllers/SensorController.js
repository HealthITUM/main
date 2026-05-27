import { sensorService } from '../services/SensorService.js';
class SensorController {
    getSensors = async (req, res) => {
        try {
            const requestPlantId = req.params.plantId;
            if (!requestPlantId) {
                return res.status(400).json({ message: "Error: PlantID is empty!" });
            }
            const parsedId = parseInt(String(requestPlantId), 10);
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }
            const sensors = await sensorService.getSensors(parsedId);
            if (!sensors) {
                return res.status(400).json({ message: "Error: Sensors could not be returned!" });
            }
            return res.status(200).json(sensors);
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
    getById = async (req, res) => {
        try {
            const requestSensorId = req.params.sensorId;
            if (!requestSensorId) {
                return res.status(400).json({ message: "Error: SensorID is empty!" });
            }
            const parsedId = parseInt(String(requestSensorId), 10);
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: SensorID must be a valid number!" });
            }
            const sensor = await sensorService.getById(parsedId);
            if (!sensor) {
                return res.status(404).json({ message: "Error: Could not find sensor with that id!" });
            }
            return res.status(200).json(sensor);
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
    create = async (req, res) => {
        try {
            // TODO
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
    delete = async (req, res) => {
        try {
            const userId = req.user?.id;
            const requestSensorId = req.params.sensorId;
            if (!requestSensorId) {
                return res.status(400).json({ message: "Error: SensorID is empty!" });
            }
            const parsedId = parseInt(String(requestSensorId), 10);
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: SensorID must be a valid number!" });
            }
            const response = await sensorService.delete(parsedId, userId);
            if (!response) {
                return res.status(400).json({ message: "Error: Failed to delete Sensor!" });
            }
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
}
export const sensorController = new SensorController();
