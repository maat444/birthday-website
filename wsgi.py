import sys
import os

# Add the project directory to the path
path = '/home/maat444/birthday-website'
if path not in sys.path:
    sys.path.append(path)

# Configure environment variables
os.environ['FLASK_ENV'] = 'production'
os.environ['FLASK_APP'] = 'app.py'

# Import and configure the application
from app import app as application
application.secret_key = 'tu_clave_secreta_aqui'