import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { MyPlantsScreen } from "../screens/MyPlantsScreen";
import { AddPlantScreen } from "../screens/AddPlantScreen"
import { MyPlantDetailsScreen } from "../screens/MyPlantsDetailsScreen";
import { EditPlantScreen } from "../screens/EditPlantScreen";
import { AddSensorScreen } from "../screens/AddSensorScreen";
import { RecipesScreen } from "../screens/RecipesScreen";
import { AddRecipeScreen } from "../screens/AddRecipeScreen";
import { RecipeDetailScreen } from "../screens/RecipeDetailScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { EditProfileScreen } from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

export const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="MyPlants" component={MyPlantsScreen} />
    <Stack.Screen name="CreatePlant" component={AddPlantScreen} />
    <Stack.Screen name="PlantDetails" component={MyPlantDetailsScreen} />
    <Stack.Screen name="EditPlant" component={EditPlantScreen} />
    <Stack.Screen name="AddSensor" component={AddSensorScreen} />
    <Stack.Screen name="Recipes" component={RecipesScreen} />
    <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetailScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);