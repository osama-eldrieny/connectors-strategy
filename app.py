from flask import Flask, jsonify, request, send_file, send_from_directory, redirect
import json
import os

app = Flask(__name__, static_folder='.', static_url_path='')

CONNECTORS_FILE = 'connectors.json'
FILTERING_FILE = 'filtering-answers.json'
REVIEWS_FILE = 'reviews.json'

def load_connectors():
    if os.path.exists(CONNECTORS_FILE):
        with open(CONNECTORS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_connectors(data):
    with open(CONNECTORS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_filtering_answers():
    if os.path.exists(FILTERING_FILE):
        with open(FILTERING_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_filtering_answers(data):
    with open(FILTERING_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def load_reviews():
    if os.path.exists(REVIEWS_FILE):
        with open(REVIEWS_FILE, 'r') as f:
            return json.load(f)
    return {'waseem': {'comment': '', 'approved': False}, 'josh': {'comment': '', 'approved': False}, 'chintan': {'comment': '', 'approved': False}}

def save_reviews(data):
    with open(REVIEWS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/connector-prioritizer.html')
def connector_prioritizer():
    return send_file('connector-prioritizer.html')

@app.route('/connector-filtering-framework-v1.html')
def connector_filtering_framework_v1():
    return send_file('connector-filtering-framework-v1.html')

@app.route('/nintex-connector-framework.html')
def framework():
    return send_file('nintex-connector-framework.html')

@app.route('/<path:filename>')
def serve_static(filename):
    if filename and '.' in filename:
        return send_from_directory('.', filename)
    return send_file('connector-prioritizer.html')

@app.route('/')
def index():
    return redirect('/connector-filtering-framework.html')

@app.route('/api/connectors', methods=['GET'])
def get_connectors():
    return jsonify(load_connectors())

@app.route('/api/connectors', methods=['POST'])
def update_connectors():
    data = request.get_json()
    save_connectors(data)
    return jsonify({'status': 'saved', 'data': data})

@app.route('/api/connectors/<int:connector_id>', methods=['PUT'])
def update_connector(connector_id):
    data = request.get_json()
    connectors = load_connectors()

    for connector in connectors:
        if connector['id'] == connector_id:
            connector.update(data)
            break

    save_connectors(connectors)
    return jsonify({'status': 'saved', 'data': connector})

@app.route('/api/filtering-answers', methods=['GET'])
def get_filtering_answers():
    return jsonify(load_filtering_answers())

@app.route('/api/filtering-answers', methods=['POST'])
def save_filtering():
    data = request.get_json()
    save_filtering_answers(data)
    return jsonify({'status': 'saved', 'data': data})

@app.route('/api/framework-review', methods=['GET'])
def get_reviews():
    return jsonify(load_reviews())

@app.route('/api/framework-review', methods=['POST'])
def save_reviews_endpoint():
    data = request.get_json()
    save_reviews(data)
    return jsonify({'status': 'saved', 'data': data})

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5002)
