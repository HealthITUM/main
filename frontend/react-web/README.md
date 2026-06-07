# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

FUNCTIONS - methods - EXPLANATION
1. USER

Register() - create a new user account:
  - endpoint: POST /user/register
  - USAGE: await userService.register(userData);
  - Input: { username: string;
             email: string;
             password: string;
            }
  - Output: IUserDTO
Flow: user fills registration form, frontend validates input, API request is sent and user is redirected to login page if success.

Login() - authenticate user and return JWT token
  - endpoint: POST /user/login
  - USAGE: const res = await userService-login(credentials);
  - Input: { username: string;
             password: string;
            }
  - Outpit: { token: string; }
Flow: user enters credentials, request is sent to backend, if it is successful, token is returned. Token is stored in localStorage, user is redirected to homepage.

GetMe() - fetch currently authenticated user
  - endpoint: /user/me
  - USAGE: const user = await userService.getMe();
  - output: IUserDTO
  IMPORTANT: requires authentication token and is used in profile page.

UpdateMe() - update current user profile data
  - endpoint: PATCH /user/me
  - USAGE: await userService.updateMe(data);
  - input: IUserUpdateRequestDTO
  - output: IUserUpdateRequestDTO

Register Page: create a new account
  - user fills in username, email... - frontend validations:
    -- password validations
    -- email validation
  - if validation passes: userService.register(form)
  - success: redirectf to /login  

Login Page: user authentication
  - enter username + password
  - validation - fields are not empty
  - call API: userService.login(form)
  - success: JWT token stored: localStorage.setItem("token", token) - user redirected to home

Profile Page: info of currently logged-in user
  - when page loads - useEffect -> call: userService.getMe()
  - stores user in state
  - display id, username, email...
  - loading state - if not yet loaded

Authentication:
 - JWT token is stored in localStorage
 - API requests use this token for protected routes
 - /user/me requires authentication
 - backend uses this token for identification

2. GENERAL - UI

In design: those are used for contolled input - each change updates state
              value={form.username}
              onChange={(e) => 
              setForm({ ...form, username: e.target.value})
              }

Authentication-based UI:
  - if not logged in: login, register
  - if logged in: profile, logout

MAP: exmple: filteredRecipes.map(recipe) => 
  - loops throught every recipe in the array - returns JSX - html like UI
  - if we have { name "Pizza" } it will return <div> Pizza </div>
Maps used for rendering plants, sensors, recipes and species dropdown.

Filtering:
plants.filter(p =>
  p.name.toLowerCase().includes(filter.toLowerCase())
)

Navigation: react router used for navigation:
navigate("/my/plants")
navigate(`/my/plants/${id}`)

If backend fails at any point there is a error handler :
 - example: if (error) return <p className="text-danger">{error}</p>; 

3. RECIPES
GetAll(): fetches all recipes from the backend
  - endpoint: GET /recipes
  - USAGE: await recipeService.getAll();
  - output: IRecipeDTO[]
Flow: recipesPage loads - then API request is sent. List of recipes is stored in state. Recipes are rendered in UI.

GetById(id): fetches a single recipe by its ID
  - endpoint: GET /recipes/:id
  - USAGE: await recipeService.getById(id);
  - output: IRecipeDTO
Flow: RecipeDetailPage loads. Id is taken from URL - useParams. API request is sent and recipe data is displayed.

Create(data): creates a new recipe in the backend
  - endpoint: POST /recipes
  - USAGE: await recipeService.create(payload);
  - input: IRecipeCreateRequestDTO
  - output: IRecipeDTO
Flow: user fills createRecipe from. Then frontend validates input - for example name required... After that payload is created, API request is sent and on success -> redirect to recipe detail page.

Update(id, data): updates an existing recipe
  - endpoint: PATCH /recipes/:id
  - usage: await recipeService.update(id, data);
  - input: IRecipeCreateRequestDTO
  - output: IRecipeDTO
Flow: existing recipe is edited. Updated data is sent then to backend and backend returns updated recipe.

Delete(id): deletes a recipe
  - endpoint: DELETE /recipes/:id
  - USAGE: await recipeService.delete(id);
  - output: void
Flow: user triggers delete action -> API request is sent and recipe is removed from backend.

RecipesPage
  - purpose: displays a list of all recipes and filters
    -- when page loads -> call recipeService.getAll()
    -- recipes stored in state
    -- UI renders recipe cards

RecipeDetailPage: detailed info about a single recipe
  - extracts id from URL - call recipeService.getById(id), stores recipe in state, renders UI.

CreateRecipePage: create a new recipe
  - authentication check: page load -> userService.getMe()
    -- failed: token is removed
    -- user redirectet to /login

Form state: stores name, description, image preview, ingredients.

Ingredients system: add, edit, remove - each has data from DTO -> id, name, amount, unit.

Validation rules: name and description is required, it has at least 1 ingredient and all have to have a name.

4. MYPLANTS
GetAll(): GET /my/plants
 - used: myplantspage
 - it fetches plants for logged in user
 Flow: page loads - useEffect. Then runs userPlantService.getAll() -> it stores result in plants state and UI renders this list.

GetById(id): GET /my/plants/:id
 - used: myplantsdetailsPage
Flow: it extracts id from URL - useParams. Then it fetches plant details and stores in plant state. End: renders plant information.

Create(): it uses FormData because image upload is included!
  - used: createPlantPage
Flow: user fills form and then validation runs. After that formData is build and API request is send.

Update(): PATCH /my/plants/:id
  - used: editing plant data - await userPlantService.update(id, formData) - editPlantPage
Flow: loads plant data and edit fields -> image upload is optional. Then it sends FormData and redirect it back to details page.

Delete(): DELETE /my/plants/:id
  - used: removing plants - await userPlantService.delete(id);
Flow: user clicks delete and then API call is send -> removes plant from state.

5. SPECIES
GetAll(): GET /species
  - usage: await specieService.getAll(); -> create and edit plant page
Flow: Page loads, species aare fetched and dropdown updates.

6. SENSORS - connected to plants
GetSensors(): GET /my/plants/:id/sensors
  - usage: await userPlantSevice.getSensors(id); - my plant details page.
Flow: plant loads, sensors load after plant fetch, it stores in sensors state.

AddSensor(): POST /my/plantts/:id/sensors
  - usage: await userPlantService.addSensor(id, { name: string }); -> add sensors
! not finished
Flow: user enters sensor name -> API is called and it redirect back to plant details.

DeleteSensor(): DELETE /my/plants/:id/sensors/:sensorId
  - usage: await userPlantService.deleteSensor(plantId, sensorId);
Flow: user clicks delete, sensor is removed from backend -> state is updated.

7. MEASUREMENTS
GetMeasurements(): GET /my/plants/:id/measurement
  - usage: await userPlantService.getMeasurements(id);
Sensor data history - expansion later.

