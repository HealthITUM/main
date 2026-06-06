import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  specieService,
  userPlantService,
  useAuth,
  plantDetectionService,
} from "@project/frontend-shared";
import type { ISpeciesDTO } from "@project/shared";
import { api } from "../src/api";
//creates apu for species and user
const userPlant = userPlantService(api);
const specie = specieService(api);
const plantDetection = plantDetectionService(api);

export default function CreatePlantPage() {
  //navigation
  const navigate = useNavigate();
  //plant name
  const [name, setName] = useState("");
  //uploaded image file - null if no file selected yet
  const [image, setImage] = useState<File | null>(null);
  const [detectImage, setDetectImage] = useState<File | null>(null);
  //preview URL so image can be shown before upload
  const [imagePreview, setImagePreview] = useState<string>("");
  const [detectPreview, setDetectPreview] = useState<string>("");
  //species from backend
  const [species, setSpecies] = useState<ISpeciesDTO[]>([]);
  //currentyl selected species - dropdows
  const [selectedSpecie, setSelectedSpecie] = useState<ISpeciesDTO | null>(
    null,
  );
  //validation, API errors
  const [errors, setErrors] = useState<string[]>([]);
  //tracks create request - disable button while saving
  const [loading, setLoading] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(true);

  const [detecting, setDetecting] = useState(false);
  const [detectedSpecieId, setDetectedSpecieId] = useState<number | null>(null);
  const [detectionFailed, setDetectionFailed] = useState(false);
  //remove for backend
  //gets token
  const { token } = useAuth();
  //is user logged in?
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);
  //prevents image preview leaks
  useEffect(() => {
    const currentPreview = imagePreview;

    return () => {
      if (currentPreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  //remove for backend
  useEffect(() => {
    //loads species from backend
    const load = async () => {
      try {
        //backend: GET /species
        const data = await specie.getAll();
        setSpecies(data);
      } catch {
        setErrors(["Failed to load species"]);
      } finally {
        setSpeciesLoading(false);
      }
    };

    load();
  }, []); //runs once only when page loads
  //runs when user selects file
  const handlePlantImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //gets first selected file
    const file = e.target.files?.[0];
    //stops if nothing gets selected
    if (!file) return;
    //stores file
    setImage(file);
    //creates temporary browser url
    setImagePreview(URL.createObjectURL(file));
  };
  const handleDetectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //gets first selected file
    const file = e.target.files?.[0];
    //stops if nothing gets selected
    if (!file) return;
    //stores file
    setDetectImage(file);
    //creates temporary browser url
    setDetectPreview(URL.createObjectURL(file));
  };
  const handleDetect = async () => {
    //if these is no image provided
    if (!detectImage) {
      setErrors(["Please select an image for detection."]);
      return;
    }
    //clears errors
    setErrors([]);
    //starts detecting state - disables detect button and shows loading
    setDetecting(true);
    setDetectedSpecieId(null);
    setDetectionFailed(false);

    try {
      //sends image to backend - post
      const { requestId } = await plantDetection.create({
        image: detectImage,
      });
      //repetedly check backend with requestID until its finished
      const result = await plantDetection.pollUntilDone(requestId);
      //if the job completed and returns species ID - it stores it
      //if it failed - marks detection as failed
      if (result.type === "DONE" && result.plantSpeciesId !== null) {
        // setDetectedSpecieId(result.plantSpeciesId);
        const found = species.find((s) => s.id === result.plantSpeciesId);
        setSelectedSpecie(found || null);
        setDetectedSpecieId(result.plantSpeciesId);
      } else {
        setDetectionFailed(true);
      }
    } catch {
      setDetectionFailed(true);
      setErrors([
        "Detection failed. Please try again or select species manually.",
      ]);
    } finally {
      setDetecting(false);
    }
  };
  //checks form before submit
  const validate = () => {
    //validation errors
    const err: string[] = [];

    if (!name.trim()) err.push("Plant name is required.");
    if (!image) err.push("Image is required.");
    if (!selectedSpecie) err.push("Please select a species.");

    return err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    //stops browser reload
    e.preventDefault();
    //validation
    const validationErrors = validate();
    //shows errors if any
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    //clears errors
    setErrors([]);
    //shows on button for example - creating...
    setLoading(true);

    try {
      //sends data to backend - creates formData
      //! besause we know its not null - validation checks before
      await userPlant.create({
        name,
        plantSpecieId: Number(selectedSpecie!.id),
        image: image!,
      });

      navigate("/my/plants");
    } catch {
      setErrors(["Failed to create plant"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark dark-green-navbar px-4">
        <div className="navbar-brand fw-bold">PlantIT</div>

        <button
          className="btn dark-green-btn ms-3"
          onClick={() => navigate("/my/plants")}
        >
          Back
        </button>
      </nav>

      <div className="container mt-4 d-flex justify-content-center">
        <div
          className="dark-green-card p-4 shadow-lg w-100"
          style={{ maxWidth: "800px" }}
        >
          <h1 className="text-center mb-4 fw-bold">Add Plant</h1>

          {errors.length > 0 && (
            <div className="alert alert-danger mb-3">
              <ul className="mb-0 list-unstyled">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="form-control dark-green-input mb-3"
              placeholder="Plant name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="mb-3">
              <input
                type="file"
                className="form-control dark-green-input"
                onChange={handlePlantImage}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-white">Species</label>

              <div className="mb-3">
                {" "}
                {/* plant detection*/}
                <input
                  type="file"
                  className="form-control dark-green-input"
                  onChange={handleDetectImage}
                />
              </div>

              {detectPreview && (
                <img
                  src={detectPreview}
                  alt="preview"
                  style={{
                    width: "25%",
                    marginTop: "10px",
                    borderRadius: "10px",
                  }}
                />
              )}

              <button
                type="button"
                className="btn dark-green-btn w-100 mt-2"
                onClick={handleDetect}
                disabled={detecting || !detectImage}
                style={{ opacity: detecting || !detectImage ? 0.6 : 1 }}
              >
                {detecting ? "Detecting..." : "Detect Species"}
              </button>

              {detectedSpecieId && !detecting && (
                <div
                  className="mt-2 p-3 rounded"
                  style={{ backgroundColor: "#4B6043" }}
                >
                  <strong className="text-white">
                    Detected:{" "}
                    {species.find((s) => s.id === detectedSpecieId)?.name ??
                      `Species #${detectedSpecieId}`}
                  </strong>
                </div>
              )}

              {detectionFailed && !detecting && (
                <div
                  className="mt-2 p-3 rounded"
                  style={{ backgroundColor: "#7a2e2e" }}
                >
                  <span className="text-white">
                    Could not detect species. Try a clearer image or select
                    manually.
                  </span>
                </div>
              )}

              {speciesLoading ? (
                <p>Loading species...</p>
              ) : (
                <select
                  className="form-select dark-green-select"
                  value={selectedSpecie?.id || ""}
                  onChange={(e) => {
                    const found = species.find(
                      (s) => s.id === Number(e.target.value),
                    );
                    setSelectedSpecie(found || null);
                  }}
                >
                  <option value="">Select species</option>
                  {species.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              className="btn dark-green-btn w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Plant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
