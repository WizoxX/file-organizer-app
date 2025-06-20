import os
import shutil
import hashlib
from flask import Flask
from your_blueprint import bp
app = Flask(__name__)
app.register_blueprint(bp)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Catégories de fichiers
FILE_CATEGORIES = {
    'Images': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
    'Documents': ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'pptx', 'csv', 'rtf'],
    'Videos': ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'],
    'Audio': ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'],
    'Archives': ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
    'Applications': ['exe', 'msi', 'dmg', 'pkg', 'apk', 'deb'],
    'Code': ['html', 'css', 'js', 'py', 'java', 'cpp', 'php', 'json']
}

def get_file_hash(filepath):
    """Calculate MD5 hash of a file"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/organize', methods=['POST'])
def organize_files():
    if 'folder' not in request.files:
        return jsonify({'error': 'No folder selected'})
    
    folder = request.files.getlist('folder')[0]
    if folder.filename == '':
        return jsonify({'error': 'No selected folder'})
    
    # Créer le dossier upload s'il n'existe pas
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    # Sauvegarder le fichier/dossier
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], folder.filename)
    folder.save(filepath)
    
    # Ici vous ajouteriez la logique d'organisation réelle
    # Pour l'exemple, nous simulons le résultat
    
    return jsonify({
        'status': 'success',
        'message': 'Files organized successfully',
        'stats': {
            'total': 42,
            'organized': 38,
            'duplicates': 4,
            'categories': [
                {'name': 'Images', 'count': 15, 'size': '45.2 MB'},
                {'name': 'Documents', 'count': 12, 'size': '8.7 MB'},
                {'name': 'Videos', 'count': 5, 'size': '1.2 GB'}
            ]
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)