from app import app
import os

# Configurar variables de entorno
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-key')
app.config['FLASK_ENV'] = os.environ.get('FLASK_ENV', 'production')

if __name__ == "__main__":
    app.run()