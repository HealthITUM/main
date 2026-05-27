import { plantSpecieService } from '../services/PlantSpecieService.js';
class PlantSpecieController {
    getSpecies = async (req, res) => {
        try {
            const species = await plantSpecieService.getSpecies();
            if (!species) {
                return res.status(400).json({ message: "Error: Species could not be returned!" });
            }
            return res.status(200).json(species);
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
    getById = async (req, res) => {
        try {
            const requestSpecieId = req.params.id;
            if (!requestSpecieId) {
                return res.status(400).json({ message: "Error: SpecieID is empty!" });
            }
            const parsedId = parseInt(String(requestSpecieId), 10);
            if (isNaN(parsedId)) {
                return res.status(400).json({ message: "Error: SpecieID must be a valid number!" });
            }
            const specie = await plantSpecieService.getById(parsedId);
            if (!specie) {
                return res.status(404).json({ message: "Error: could not find specie with that id!" });
            }
            return res.status(200).json(specie);
        }
        catch (error) {
            return res.status(500).json({ message: "Error on the server." });
        }
    };
}
export const plantSpecieController = new PlantSpecieController();
