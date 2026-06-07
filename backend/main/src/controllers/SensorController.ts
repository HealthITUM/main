import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { sensorService } from '../services/SensorService.js';
import type { ISensorCreateModel } from '../models/Sensor.js';
import type { ISensorCreateResponseDTO } from '@project/shared';

class SensorController {
    getSensors = async (req: AuthRequest, res: Response) => {
        try {
            const requestPlantId = req.params.plantId;
            
            if (!requestPlantId){
                return res.status(400).json({ message : "Error: PlantID is empty!"});
            }
    
            const parsedId = parseInt(String(requestPlantId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }
    
            const sensors = await sensorService.getSensors(parsedId);
            
            if (!sensors) {
                return res.status(400).json({ message: "Error: Sensors could not be returned!"});
            }
            return res.status(200).json(sensors);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    getById = async (req: AuthRequest, res: Response) => {
        try {
            const requestSensorId = req.params.sensorId;

            if (!requestSensorId){
                return res.status(400).json({ message : "Error: SensorID is empty!"});
            }
    
            const parsedId = parseInt(String(requestSensorId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: SensorID must be a valid number!" });
            }

            const sensor = await sensorService.getById(parsedId);

            if (!sensor) {
                return res.status(404).json({ message: "Error: Could not find sensor with that id!"});
            }

            return res.status(200).json(sensor);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }

    create = async (req : AuthRequest, res : Response) => {
        try {
            const requestPlantId = req.params.plantId;
            
            if (!requestPlantId){
                return res.status(400).json({ message : "Error: PlantID is empty!"});
            }
    
            const parsedId = parseInt(String(requestPlantId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: PlantID must be a valid number!" });
            }

            const data : ISensorCreateModel = {
                userPlantId : parsedId
            }

            const response = await sensorService.create(data)

            if (!response) {
                return res.status(400).json({ message: "Error: Failed to add Sensor!"})
            }

            const responseData : ISensorCreateResponseDTO = {
                userPlantId : parsedId,
                mosquitto_url : (process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "empty" ),
                mosquitto_user : (process.env.MOSQUITTO_USER ? process.env.MOSQUITTO_USER : "empty" ),
                mosquitto_password : (process.env.MOSQUITTO_PASSWORD ? process.env.MOSQUITTO_PASSWORD : "empty" ),
                mosquitto_port : (process.env.MOSQUITTO_PORT ? process.env.MOSQUITTO_PORT : "1883" )
            }

            return res.status(200).json(responseData);
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }   
    }

    delete = async (req : AuthRequest, res : Response) => {
        try {
            const userId = req.user?.id!;
            const requestSensorId = req.params.sensorId;
            
            if (!requestSensorId){
                return res.status(400).json({ message : "Error: SensorID is empty!"});
            }
    
            const parsedId = parseInt(String(requestSensorId), 10);
    
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: SensorID must be a valid number!" });
            }

            const response = await sensorService.delete(parsedId);

            if (!response) {
                return res.status(400).json({ message: "Error: Failed to delete Sensor!"})
            }

            return res.status(200).json({ message: "Success: Sensor deleted!"});
        }
        catch (error){
            return res.status(500).json({ message : "Error on the server." });
        }
    }
}

export const sensorController = new SensorController();