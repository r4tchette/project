import tensorflow as tf
import keras
import sys
import json
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
model = None
label = ("Adiantum", "Alocasia macrorrhizos", "Ficus benjamina", "Hedra helix", "Lavandula", "Narcissus", "Pelargonium inquinans")

def approaching_model():
    global model
    model = load_model('py/core_box.h5',  compile=False)
    global graph
    graph = tf.get_default_graph()

def prepare_image(image, target):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image /= 255
    return image

def predict(path):
    image = Image.open(path)
    image = prepare_image(image, target=(200, 200))
    image = np.array(image)

    with graph.as_default():
        preds = model.predict(image)
    preds = preds * 100
    preds = preds.astype(np.float64)
    results = tuple(map(tuple, preds))
    results = results[0]
    results = dict(zip(label, results))
    data = {'predictions': results}
    print(json.dumps(data))

sess = keras.backend.get_session()
approaching_model()
predict(sys.argv[1])
