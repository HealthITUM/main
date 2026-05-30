## Frontend-Mobile
Using React-native for frontend on Mobile.

1. AUTHENTICATION
Uses context based authenticatio system + AsyncStorage for login and axios-based API service layer for backend communication.

    - handled through:
    -- AuthContext - global auth state
    -- AsyncStorage - persistent token storage
    -- userService - api comm. layer

AuthContext:
Manages global authentication state, provides current token, login and logout function.
    Values: 
    type AuthContextType = {
    token: string | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    };

Functions:
1. login - token
Stores token in react state and AsyncStorage: await login("JWT_TOKEN");
 - it sets token in memory and saves token in AsyncStorage
Stores token globally!: await login(token);

2. logout - clears authentication: await logout();
Removes token from state and deletes token from AsyncStorage.

3. Hook usage: const { token, login, logout } = useAuth(); -> it needs to be used inside AuthProvider!

Provides setup - wrapping the app with: 
<AuthProvider>
  <NavigationContainer>
    <App />
  </NavigationContainer>
</AuthProvider>

API layer for user: handles all authentication related API requests...

Register(userData): register(userData: IUserRegisterRequestDTO) - creates new user acount
    - endpoint: POST /user/register
    - usage: await userService.register(userData);
    Sends: username, email and password
    Returns: IUserDTO
    Flow: user fills registration form - frontend validates input so email..., API request is send and if its successfull user is redirected to Login page.

Login(userData): login(userData: IUserLoginRequestDTO): authenticates user and return JWT token
    - endpoint: POST /user/login
    Returns: token: string
    Usage: const res = await userService.login(credentials);
    Input: is username - string and same for password
    Flow: user enters credentials and frontend validates empty fields. API request is sent and backend returns JWT token. Token is stored in AuthContext + AsyncStorage. User is redirected to home page.

GetMe: GET /user/me
    - requires authentication token!
    Returns current user - IUserDTO.
    Usage: const user = await userService.getMe();
    Flow: app sends request with token and then backedn identifies user. Return user data.

UpdateMe: PATCH /user/me
    Updates logged-in user profile
    Usage: await userService.updateMe(data);
    Input: IUserUpdateRequestDTO
    Returns: IUserDTO.
    Flow: user edits profile, frontend sends patrial update. Then backend updates user and returns updated data.

AsyncStorage is used for persistent login, key is "token".
Save token: AsyncStorage.setItem("token", token);
Remove token: AsyncStorage.removeItem("token");
Flow: at login token is saved, with logout its removed.

2. UI PART
<TouchableOpacity onPress={() => setMenuVisible(!menuVisible)> -> toggles dropdown menu open/close

Dropdown logic: {menuVisible && ( ... )} - only shows when menuVisible is true!

ERROR: error ? 
  <View style={...}> ... shows error message for example validation or API errors

FORM: example: setForm({ ...form, username: text }) -> updates only username field...

FLATLIST: used for rendering dynamic plant
    <FlatList
    data={filteredPlants}
    renderItem={({ item ...=> (...)
/>
Conditional rendering: 
Example: displays image only if it exists
    {imagePreview ? 
    <Image source={{ uri: imagePreview } />
 : null

MAPS: 
species.map(s) =>  loops throught all species, errors for example


3. USERPLANTS
MyPlantsScreen: displays all plants for logged in user with search, edit, delete and navigation to details.

Get all plants: fetches all plants for logged in user.
    - endpoint: GET /my/plants
    - usage: await userPlant.getAll();
    Returns: IUserPlantDTO[]
Flow: screen loads. API request fetches plants, which are stored in state.
Example: const data = await userPlant.getAll();
        setPlants(data);ž

Get single plant: fetches one specific plant details.
    - endpoint: GET /my/plants/:id
    - usage: await userPlant.getById(id);
    Returns: IUserPlantDTO
Flow: user opens details page and then API request is send. Backend returns plant data and UI renders details and image.
Example:
    const plantData =
    await userPlant.getById(String(id));

    setPlant(plantData);

Create plant: Creates new plant with multipart image upload.
    - endpoint: POST /my/plants
    - usage: await userPlant.create(data);
    - Input: name, plantSpecieId, image
    Returns: IUserPlantDTO
Flow: user entern name and selects image, species. Then frontend validates input and multipart/form-data request is send. Backend creates plant and user is redirected back.
Example:
    await userPlant.create({
    name,
    plantSpecieId: Number(selectedSpecie!.id),
    image: {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
    },
});

Update plants: Updates existing plant information.
    - endpoint: PATCH /my/plants/:id
    - usage: await userPlant.update(id, data);
    - Input: name, plantSpecieId
    Returns: IUserPlantDTO
Flow: plant loads information form. User edits some values and then validation runs. PATCH request is sent and backend updates plant. User is redirected back.
Example: 
    await userPlant.update(id, {
    name,
    plantSpecieId: selectedSpecie.id,
});

Delete plant: Deletes selected plant.
    - endpoint: DELETE /my/plants/:id
    - usage: await userPlant.delete(id);
Flow: user presses delete and alert confirmation appears. API request is sent and plant is removed from backend and local state.
Example: await userPlant.delete(String(plantId));
Local state update: 
    setPlants((prev) =>
    prev.filter((p) => p.id !== plantId)
);

Get sensors: Fetches all sensors connected to plant.
    - endpoint: GET /my/plants/:id/sensors
    - usage: await userPlant.getSensors(id);
    Returns: ISensorDTO[]
Flow: details page opens and sensors are fetched. Sensors get rendered in list.
Example:
    const sensorData =
    await userPlant.getSensors(String(id));

setSensors(sensorData);

Add sensor: Adds new sensor to plant.
    - endpoint: POST /my/plants/:id/sensors
    - usage: await userPlant.addSensor(id, data);
    - Input: name: string
    Returns: ISensorDTO
Flow: user enters sensor name and validation runs. API request is sent and backend creates sensor - user is redirected back.
Example:
    await userPlant.addSensor(id, {
    name: sensorName,
});

Delete sensor: Deletes sensor from plant.
    - endpoint: DELETE /my/plants/:id/sensors/:sensorId
    - usage: await userPlant.deleteSensor(id, sensorId);
Flow: user presses delete sensor and then API request is sent. Sensor is removed from backend and local state.
Example:
    await userPlant.deleteSensor(
    String(id),
    String(sensorId)
);
State update:
    setSensors((prev) =>
    prev.filter((s) => s.id !== sensorId)
);

4. SPECIES: handles all plant species related API requests

Get all: Fetches all plant species.
    - endpoint: GET /species
    - usage: await specie.getAll();
    Returns: ISpecieDTO[]
Flow: screen loads and species are fetched. Species are displayed as selectable list.
Example:
    const data = await specie.getAll();
    setSpecies(data);

GetById: fetches one specific species.
    - endpoint: GET /species/:id
    - usage: await specie.getById(id);
    Returns: ISpecieDTO

5. SOME IMPLEMENTATIONS

Image upload: uses expo image picker for selecting gallery images.
Example:
    const result =
    await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
            ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    });
Flow: user opens gallery and selects an image - image is stored in state and preview is rendered.
Preview: <Image source={{ uri: imagePreview...

Search filter: filters plants by name.
Example: 
    const filteredPlants = plants.filter((plant) =>
    nameFilter.trim() === "" ||
    plant.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase())
);
Flow: user types into search input -> state gets updated and FlatList renders filtered plants.

Navigation: react navigation
Example:
    navigation.navigate("PlantDetails", {
    id: item.id,
});

6. RECIPES
Get All: fetches all recipes
    - endpoint: GET /recipe
    Returns: IRecipeDTO[]
Flow: screen loads and api request is made. Data is stored in state.
Example:
    const data = await recipeApi.getAll();
    setRecipes(data);

GetById(id): fetches single recipe by ID
    - Endpoint: GET /recipes/:id
    Returns: IRecipeDTO
Flow: user opens details screen, api request fetches recipes and UI renders result.
Example: const recipe = await recipeApi.getById(id);

Create(data): Creates a new recipe (supports image upload).
    - Endpoint: POST /recipes
    - Uses: multipart/form-data
    Returns: IRecipeDTO
Flow: user fills form, validation is run and form data is created. API request is sent and user is redirected to details.
Example: await recipeApi.create({
            name,
            description,
            ingredients,
            image,
            });

Delete(id): Deletes a recipe.
    - Endpoint: DELETE /recipes/:id
    Returns: void
Flow: User confirms deletion, API call is executed and local state is updated.
Example: await recipeApi.delete(id);

.apk - run
npm install -g eas-cli - needs to be downloaded
You need to create account on expo.dev.
Then you log in: npm install -g eas-cli
Inicialize EAS: eas build:configure
Build APK: eas build -p android --profile preview - takes and while and they you get link to download this app :3