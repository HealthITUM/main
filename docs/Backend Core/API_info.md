# Backend Core. API-Endpoints.

## 1. Basic.

All **API-endpoints** starts with `<URL>/api/`

## 2. User endpoints.

### 2.1

```
GET /user/me
```

Get all data of user that logined in. Authorization through JWT-tokens.

### 2.2

```
POST /user/login
```

Sending **login** data to backend.

### 2.3

```
POST /user/register
```

Sending **register** data to backend.

### 2.4

```
PATCH /user/me
```

Changing some information of **user** (ex. Password, username, email, exc.).

## 3. User_Plants endpoints.

### 3.1

```
GET /my/plants/
```

Getting list of **logined user plants**.

### 3.2

```
GET /my/plants/:id
```

Get exact **user plant**.

### 3.3

```
POST /my/plants/
```

Create **new plant**.

### 3.4

```
PATCH /my/plants/:id
```

**Changing some** information of **plant**.

### 3.5

```
DELETE /my/plants/:id
```

**Deleting plant**.

### 3.6. Sensors endpoints.

#### 3.6.1

```
GET /my/plants/:id/sensors
```

Get **all sensors** that connected to **exact plant**

#### 3.6.2

```
POST /my/plants/:id/sensors
```

**Add new sensor** to the plant.

### 3.7. Measurements endpoints.

```
GET /my/plants/:id/measurements
```

Get **all measurements** for exact plant.

## 4. Species (of plants).

### 4.1

```
GET /species/
```

Get **all species** that available. Can be modified with params.

### 4.2

```
GET /species/:id
```

Get exact **specie of plant**.

## 5. Recipes.

### 5.1

```
GET /recipes/:id
```

Get **exact recipe**.

### 5.2

```
GET /recipes/
```

Get **list of recipes**. Can be modified with params (recipes?params=...)

### 5.3

```
POST /recipes/
```

Creating **new recipe**.
