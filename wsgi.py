import sys

# Esta linha adiciona o caminho do seu projeto ao sistema do Python.
# É CRÍTICO que o caminho esteja CORRETO para o seu ambiente na Hostinger.
# Vamos encontrar o caminho exato no próximo sub-passo.
sys.path.insert(0, '/home/u123456789/domains/beige-penguin-259347.hostingersite.com/public_html')

# Esta linha importa o seu aplicativo Flask.
# 'app' é o nome da sua instância Flask no seu arquivo app.py (ex: app = Flask(__name__))
from app import app as application
