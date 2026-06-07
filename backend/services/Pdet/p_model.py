import tensorflow as tf
import json

# Loads the classes names.
with open('plant_classifier_final_classes.json', 'r') as f:
    CLASS_NAMES = json.load(f)

# Same struct as in keras.
base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights=None)
inputs = tf.keras.layers.Input(shape=(224, 224, 3))
x = tf.keras.layers.Rescaling(1. / 127.5, offset=-1)(inputs)  # normalization (-127 to 127)
x = base_model(x)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

# Load weights.
model.load_weights('plant_weights.weights.h5')
print("Model and weights loaded!")