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
  <View style={...}> ... shows error message

FORM: example: setForm({ ...form, username: text }) -> updates only username field...

