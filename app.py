from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from itertools import combinations
from collections import Counter

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Ningún archivo fue enviado'}), 400

    df = pd.read_csv(request.files['file'], header=None)
    resultados = {}
    for tam in range(3, 8):
        cont = Counter()
        for _, row in df.iterrows():
            nums = list(map(int, row.dropna()))
            for combo in combinations(sorted(nums), tam):
                cont[combo] += 1
        top = cont.most_common(10)
        resultados[str(tam)] = [{"combinación": list(c), "repeticiones": r} for c, r in top]

    return jsonify(resultados)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
