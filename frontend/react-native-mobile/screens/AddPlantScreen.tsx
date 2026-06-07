import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  specieService,
  userPlantService,
  useAuth,
  plantDetectionService,
} from "@project/frontend-shared";
import type { ISpeciesDTO } from "@project/shared";
import { api } from "../src/api";
import { styles } from "../src/styles";
//API service setup - we create plant and species API service
//used for requests
const userPlant = userPlantService(api);
const specie = specieService(api);
const plantDetection = plantDetectionService(api);
//union type - can only be one of those
type SpeciesMode = "manual" | "detect";

//navigation for example for back button
export const AddPlantScreen = ({ navigation }: any) => {
  //gets authentication token from AuthContext - protects routes
  const { token } = useAuth();
  //plant name input
  const [name, setName] = useState("");
  //image file object
  const [image, setImage] = useState<any>(null);
  //local image URI for preview
  const [imagePreview, setImagePreview] = useState("");
  //species fetched from backend
  const [species, setSpecies] = useState<ISpeciesDTO[]>([]);
  //validation/API errors
  const [errors, setErrors] = useState<string[]>([]);
  //sumbit and species loading
  const [loading, setLoading] = useState(false);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [selectedSpecieId, setSelectedSpecieId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  //detection states
  //which mode - default to manual
  const [speciesMode, setSpeciesMode] = useState<SpeciesMode>("manual");
  //same as image, image preview but for detection image
  const [detectImage, setDetectImage] = useState<any>(null);
  const [detectImagePreview, setDetectImagePreview] = useState("");
  //if detection is in progress
  const [detecting, setDetecting] = useState(false);
  const [detectedSpecieId, setDetectedSpecieId] = useState<number | null>(null);
  const [detectionFailed, setDetectionFailed] = useState(false);

  // species load
  useEffect(() => {
    requestPermissions();
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
  }, []); //runs once when screen loads
  //remove for backend - is user logged in?
  useEffect(() => {
    if (!token) {
      navigation.replace("Login");
    }
  }, [token, navigation]); //runs if token or navigation is changed
  //when user presses choose image
  const pickImage = async () => {
    //opens phone gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      //images only
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //highest quality
      quality: 1,
    });

    if (!result.canceled) {
      //gets selected image object
      const file = result.assets[0];
      //image is stored - used for upload and preview rendering
      setImage(file);
      setImagePreview(file.uri);
    }
  };
  //same as pick image - only opens camera instead of gallery
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setImage(file);
      setImagePreview(file.uri);
    }
  };
  //samo as pick image and take photo - used here to detect image
  const pickDetectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setDetectImage(file);
      setDetectImagePreview(file.uri);
      setDetectedSpecieId(null);
      setDetectionFailed(false);
    }
  };

  const takeDetectPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const file = result.assets[0];
      setDetectImage(file);
      setDetectImagePreview(file.uri);
      setDetectedSpecieId(null);
      setDetectionFailed(false);
    }
  };

  // const handleDetect = async () => {
  //     //if there is no image - error
  //     if (!detectImage) {
  //         setErrors(["Please select an image for detection."]);
  //         return;
  //     }
  //     //clears errors
  //     setErrors([]);
  //     //starts detecting state - disables detect button and shows loading
  //     setDetecting(true);
  //     setDetectedSpecieId(null);
  //     setDetectionFailed(false);

  //     try {
  //         //fake data
  //         await new Promise(resolve => setTimeout(resolve, 3000)); // simulate 3s delay
  //         const fakeSpecieId = species[0]?.id ?? 1; // takes first species from loaded list
  //         setDetectedSpecieId(Number(fakeSpecieId));

  //         //for failure:
  //         //setDetectionFailed(true);
  //     } catch {
  //         setDetectionFailed(true);
  //         setErrors(["Detection failed. Please try again or select species manually."]);
  //     } finally {
  //         setDetecting(false);
  //     }
  // };

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
        image: {
          uri: detectImage.uri,
          name: detectImage.fileName ?? "photo.jpg",
          type: detectImage.type ?? "image/jpeg",
        } as any,
      });
      //repetedly check backend with requestID until its finished
      const result = await plantDetection.pollUntilDone(requestId);
      //if the job completed and returns species ID - it stores it
      //if it failed - marks detection as failed
      if (result.type === "DONE" && result.plantSpeciesId !== null) {
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

  const requestPermissions = async () => {
    const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const camera = await ImagePicker.requestCameraPermissionsAsync();

    if (!media.granted || !camera.granted) {
      alert("Permissions are required to use this feature.");
    }
  };

  const validate = () => {
    //checks if form is valid
    const err: string[] = [];
    if (!name.trim()) err.push("Plant name is required.");
    if (!image) err.push("Image is required.");
    const resolvedSpecieId =
      speciesMode === "detect" ? detectedSpecieId : selectedSpecieId;
    if (!resolvedSpecieId) {
      if (speciesMode === "detect") {
        err.push("Please run detection first or switch to manual selection.");
      } else {
        err.push("Please select a species.");
      }
    }
    return err;
  };
  //runs when user presses create plant
  const handleSubmit = async () => {
    //validate form, returns string
    const validation = validate();
    //if error exists it stops API request
    if (validation.length) {
      //stores errors in state
      setErrors(validation);
      return;
    }
    //clears old errors before new request
    setErrors([]);
    //starts loading state
    setLoading(true);

    const resolvedSpecieId =
      speciesMode === "detect" ? detectedSpecieId! : selectedSpecieId!;

    try {
      //calls create - backend: POST /my/plants
      await userPlant.create({
        name,
        plantSpecieId: Number(resolvedSpecieId),
        image: {
          uri: image.uri,
          name: image.fileName ?? "photo.jpg",
          type: image.type ?? "image/jpeg",
        } as any, //any for react native file uploads
      });
      navigation.goBack();
    } catch {
      setErrors(["Failed to create plant"]);
    } finally {
      setLoading(false);
    }
  };
  //looks up human readable species name from loaded list
  const detectedSpeciesName = detectedSpecieId
    ? species.find((s) => s.id === detectedSpecieId)?.name
    : null;

  return (
    <View style={styles.appContainer}>
      <SafeAreaView style={styles.appContainer}>
        <View
          style={[
            styles.darkGreenNavbar,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 999,
              elevation: 10,
              paddingHorizontal: 12,
            },
          ]}
        >
          <Text style={[styles.title, { color: "white" }]}>PlantIT</Text>

          <TouchableOpacity
            style={styles.darkGreenButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.darkGreenButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View
            style={[
              styles.darkGreenCard,
              {
                maxWidth: 800,
                alignSelf: "center",
                width: "100%",
                padding: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  textAlign: "center",
                  marginBottom: 15,
                  fontWeight: "600",
                },
              ]}
            >
              Add Plant
            </Text>

            {errors.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                {errors.map((e, i) => (
                  <Text key={i} style={{ color: "#ff6b6b" }}>
                    {e}
                  </Text>
                ))}
              </View>
            )}

            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              placeholder="Plant name"
              value={name}
              onChangeText={setName}
            />

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
              <TouchableOpacity
                style={[
                  styles.darkGreenButton,
                  { flex: 1, justifyContent: "center", alignItems: "center" },
                ]}
                onPress={pickImage}
              >
                <Text style={styles.darkGreenButtonText}>
                  Choose Image from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.darkGreenButton,
                  { flex: 1, justifyContent: "center", alignItems: "center" },
                ]}
                onPress={takePhoto}
              >
                <Text style={styles.darkGreenButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>

            {imagePreview ? (
              <Image
                source={{ uri: imagePreview }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />
            ) : null}

            <Text
              style={{ color: "white", marginBottom: 5, fontWeight: "800" }}
            >
              Species
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginBottom: 14,
                borderRadius: 8,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#4B6043",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor:
                    speciesMode === "manual" ? "#4B6043" : "transparent",
                }}
                onPress={() => setSpeciesMode("manual")}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Select manually
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor:
                    speciesMode === "detect" ? "#4B6043" : "transparent",
                }}
                onPress={() => setSpeciesMode("detect")}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Detect from image
                </Text>
              </TouchableOpacity>
            </View>

            {speciesMode === "manual" && (
              <View style={{ position: "relative", zIndex: 2000 }}>
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={[
                    styles.input,
                    {
                      height: 44,
                      justifyContent: "center",
                      marginBottom: 10,
                    },
                  ]}
                >
                  <Text style={{ color: "#4B6043" }}>
                    {selectedSpecieId
                      ? species.find((s) => s.id === selectedSpecieId)?.name
                      : "Select species"}
                  </Text>
                </TouchableOpacity>

                {open && (
                  <View
                    style={{
                      position: "absolute",
                      top: 50,
                      left: 0,
                      right: 0,
                      backgroundColor: "#A3C585",
                      borderRadius: 8,
                      zIndex: 9999,
                      elevation: 50,
                      maxHeight: 200,
                    }}
                  >
                    <ScrollView>
                      {species.map((s) => (
                        <TouchableOpacity
                          key={s.id}
                          onPress={() => {
                            setSelectedSpecieId(Number(s.id));
                            setOpen(false);
                          }}
                          style={{ padding: 12 }}
                        >
                          <Text style={{ color: "white" }}>{s.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            {speciesMode === "detect" && (
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.darkGreenButton,
                      {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                    onPress={pickDetectImage}
                  >
                    <Text style={styles.darkGreenButtonText}>
                      Choose Detection Image
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.darkGreenButton,
                      {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                    onPress={takeDetectPhoto}
                  >
                    <Text style={styles.darkGreenButtonText}>
                      Take Detection Photo
                    </Text>
                  </TouchableOpacity>
                </View>

                {detectImagePreview ? (
                  <Image
                    source={{ uri: detectImagePreview }}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 12,
                      marginBottom: 10,
                    }}
                  />
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.darkGreenButton,
                    {
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: detecting || !detectImage ? 0.6 : 1,
                    },
                  ]}
                  onPress={handleDetect}
                  disabled={detecting || !detectImage}
                >
                  {detecting ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <ActivityIndicator size="small" color="white" />
                      <Text style={styles.darkGreenButtonText}>
                        Detecting...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.darkGreenButtonText}>
                      Detect Species
                    </Text>
                  )}
                </TouchableOpacity>

                {detectedSpecieId && !detecting && (
                  <View
                    style={{
                      marginTop: 10,
                      padding: 12,
                      backgroundColor: "#4B6043",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      Detected:{" "}
                      {detectedSpeciesName ?? `Species #${detectedSpecieId}`}
                    </Text>
                  </View>
                )}

                {detectionFailed && !detecting && (
                  <View
                    style={{
                      marginTop: 10,
                      padding: 12,
                      backgroundColor: "#7a2e2e",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      Could not detect species. Try a clearer image or select
                      manually.
                    </Text>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity
              style={[styles.darkGreenButton, { marginTop: 15 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.darkGreenButtonText}>
                {loading ? "Creating..." : "Create Plant"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
