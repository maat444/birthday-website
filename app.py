from flask import Flask, render_template, send_from_directory
from flask_caching import Cache
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

def get_image_files():
    """Obtiene las imágenes disponibles en la carpeta static/images"""
    image_dir = os.path.join(app.static_folder, 'images')
    images = [f for f in os.listdir(image_dir) if f.endswith('.webp')]
    images.sort()  # Ordena alfabéticamente
    return images

IMAGE_DETAILS = {
    # El nombre del archivo es la clave
    'cualquier-nombre.webp': {
        'title': 'Tu título personalizado',
        'description': 'Tu descripción personalizada'
    }
    # Agrega más entradas según necesites
}

# Definir las imágenes y sus detalles usando los archivos reales
def get_carousel_images():
    images = get_image_files()
    return [
        {
            'src': img,
            'alt': f'Recuerdo especial {i+1}',
            'title': IMAGE_DETAILS.get(img, {}).get('title', f'Momento {i+1}'),
            'description': IMAGE_DETAILS.get(img, {}).get('description', f'Descripción {i+1}')
        }
        for i, img in enumerate(images[:4])  # Limita a 4 imágenes
    ]

VIDEO_DETAILS = {
    'name': 'background.mp4',
    'formats': ['mp4'],  # Simplificado a solo MP4
    'poster': 'video-poster.jpg',
    'autoplay': True,
    'loop': True,
    'muted': True
}

def get_video_info():
    video_dir = os.path.join(app.static_folder, 'video')
    video_path = os.path.join(video_dir, VIDEO_DETAILS['name'])
    poster_path = os.path.join(video_dir, VIDEO_DETAILS['poster'])
    
    return {
        'name': VIDEO_DETAILS['name'],
        'formats': VIDEO_DETAILS['formats'],
        'poster': VIDEO_DETAILS['poster'],
        'exists': os.path.exists(video_path),
        'poster_exists': os.path.exists(poster_path),
        'autoplay': VIDEO_DETAILS['autoplay'],
        'loop': VIDEO_DETAILS['loop'],
        'muted': VIDEO_DETAILS['muted']
    }

AUDIO_DETAILS = {
    'name': 'background-music.mp3',
    'autoplay': False,
    'loop': True,
    'volume': 0.5,
    'chunk_size': 1024 * 1024  # 1MB chunks para streaming
}

def get_audio_info():
    audio_dir = os.path.join(app.static_folder, 'audio')
    audio_path = os.path.join(audio_dir, AUDIO_DETAILS['name'])
    
    return {
        'name': AUDIO_DETAILS['name'],
        'exists': os.path.exists(audio_path),
        'autoplay': AUDIO_DETAILS['autoplay'],
        'loop': AUDIO_DETAILS['loop'],
        'volume': AUDIO_DETAILS['volume']
    }

@app.route('/')
@cache.cached(timeout=300)  # Cache for 5 minutes
def home():
    carousel_images = get_carousel_images()
    video_info = get_video_info()
    audio_info = get_audio_info()
    return render_template('index.html', 
                         images=carousel_images, 
                         video=video_info,
                         audio=audio_info)

@app.route('/images/<path:filename>')
@cache.cached(timeout=3600)  # Cache por 1 hora
def serve_image(filename):
    response = send_from_directory('static/images', filename)
    if filename.endswith('.webp'):
        response.headers['Content-Type'] = 'image/webp'
    return response

@app.route('/video/<path:filename>')
@cache.cached(timeout=3600)  # Cache por 1 hora
def serve_video(filename):
    response = send_from_directory('static/video', filename)
    if filename.endswith('.mp4'):
        response.headers['Content-Type'] = 'video/mp4'
    elif filename.endswith('.webm'):
        response.headers['Content-Type'] = 'video/webm'
    return response

@app.route('/audio/<path:filename>')
@cache.cached(timeout=7200)  # Aumentado a 2 horas
def serve_audio(filename):
    response = send_from_directory('static/audio', filename)
    response.headers['Content-Type'] = 'audio/mpeg'
    response.headers['Accept-Ranges'] = 'bytes'
    response.headers['Cache-Control'] = 'public, max-age=7200'
    return response

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static', 'images'),
                             'favicon.png', mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=False)
