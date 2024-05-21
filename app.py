import re
import psycopg2, psycopg2.extras
from flask import Flask, request, flash, render_template, session, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from cryptography.fernet import Fernet
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

USER_DB = 'postgres'
PASS_DB = 'admin'
URL_DB = 'localhost'
NAME_DB = 'rancho_la_98'

FULL_URL_DB = f'postgresql://{USER_DB}:{PASS_DB}@{URL_DB}/{NAME_DB}'

app.config['SQLALCHEMY_DATABASE_URI'] = FULL_URL_DB

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.secret_key = 'gabo-tefa-mari_juli'

app.config['carrito'] = []

db = SQLAlchemy(app)
key = Fernet.generate_key()
cipher_suite = Fernet(key)

productos = []

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)



migrate = Migrate()
migrate.init_app(app, db)

conn = psycopg2.connect(dbname=NAME_DB, user=USER_DB, password=PASS_DB, host=URL_DB)


@app.route('/index')
def index_page():
    if 'inicio_sesion' in session:
        return render_template('index.html', nombre_usuario=session['nombre_usuario'])
    return redirect(url_for('login'))

@app.route('/api/productos')
def obtener_productos():
    return jsonify(productos)

@app.route('/mi-cuenta')
def mi_cuenta():
    if 'inicio_sesion' in session:
        return render_template('mi_cuenta.html', nombre_usuario=session['nombre_usuario'])
    return redirect(url_for('login'))

@app.route('/actualizar_productos', methods=['POST'])
def actualizar_productos():
    data = request.get_json()
    nombre_producto = data['nombre']
    global productos
    productos = [producto for producto in productos if producto["nombre"] != nombre_producto]
    # Retorna una respuesta si es necesario
    return jsonify({"message": "Producto eliminado correctamente"})

@app.route('/validar-pago', methods=['POST'])
def validar_pago():
    global productos
    productos.clear()
    return

@app.route('/')
def default_page():
    if 'inicio_sesion' in session:
        return render_template('index.html', nombre_usuario=session['nombre_usuario'])
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'inicio_sesion' in session:
        return redirect(url_for('index_page'))
    else:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        if request.method == 'POST' and 'sign-up-email' in request.form and 'sign-up-password' in request.form:
            password = request.form['sign-up-password']
            email = request.form['sign-up-email']
            cursor.execute('SELECT * FROM usuario WHERE email = %s', (email,))
            cuenta = cursor.fetchone()

            if cuenta:
                password_hash = cuenta['password_hash']
                if check_password_hash(password_hash, password):
                    session['inicio_sesion'] = True
                    session['id_inicio_sesion'] = cuenta['id']
                    session['correo'] = cuenta['email']
                    session['nombre_usuario'] = cuenta['username']
                    return redirect(url_for('index_page'))
                else:
                    flash('¡Usuario o contraseña incorrectos!')
            elif not email or not password:
                flash('¡Por favor llene todos los campos del formulario!')
            elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                flash('¡Correo electronico inválido!')
            else:
                flash('¡Usuario o contraseña incorrectos!')

        elif request.method == 'POST':
            flash('¡Por favor llene todos los campos del formulario!')
        return render_template('login.html')


@app.route('/cerrar-sesion')
def cerrar_sesion():
    session.pop('inicio_sesion', None)
    session.pop('id_inicio_sesion', None)
    session.pop('correo', None)
    session.pop('nombre_usuario', None)
    productos.clear()
    return redirect(url_for('login'))


@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if 'inicio_sesion' in session:
        return redirect(url_for('index_page'))
    else:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        if request.method == 'POST' and 'sign-ip-username' in request.form and 'sign-ip-email' in request.form and 'sign-ip-password' in request.form:
            name = request.form['sign-ip-username']
            password = request.form['sign-ip-password']
            _password_hash = generate_password_hash(password)
            print(f'registro')
            email = request.form['sign-ip-email']
            cursor.execute('SELECT * FROM usuario WHERE email = %s', (email, ))
            cuenta = cursor.fetchone()

            if cuenta:
                flash('¡El correo ya esta registrado!')
            elif not name or not email or not password:
                flash('¡Por favor llene todos los campos del formulario!')
            elif not re.match(r'^[A-Za-z\s]+$', name):
                flash('¡El nombre solo puede contener letras!')
            elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
                flash('¡Correo electronico inválido!')
            else:
                cursor.execute("INSERT INTO usuario (username, email, password_hash) values (%s,%s,%s)", (name, email, _password_hash))
                conn.commit()
                flash('¡Información registrada!')
        elif request.method == 'POST':
            flash('¡Por favor llene todos los campos del formulario!')
        return render_template('registro.html')


@app.errorhandler(404)
def pagina_invalida(e):
    return render_template('404.html')


@app.route('/carrito-de-compras')
def carrito_de_compras():
    if 'inicio_sesion' in session:
        return render_template('carrito.html')
    return redirect(url_for('login'))


@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    data = request.get_json()
    if any(producto['nombre'] == data['nombre'] for producto in productos):
        return jsonify({"message": "¡El producto ya esta agregado en el carrito!"})

    nuevo_producto = {
        "nombre": data["nombre"],
        "precio": data["precio"],
        "imagen": data["imagen"]
    }
    productos.append(nuevo_producto)
    return jsonify({"message": "¡Producto agregado con éxito!"})


@app.route('/obtener_cantidad_productos', methods=['GET'])
def obtener_cantidad_productos():
    cantidad_productos = len(productos)
    return jsonify({'cantidad': cantidad_productos})


@app.route('/nuestros-productos')
def catalogo_productos():
    if 'inicio_sesion' in session:
        return render_template('catalogo.html', listaProductos=productos)
    return redirect(url_for('login'))


@app.route('/ver')
def ver():
    if 'inicio_sesion' in session:
        usuario = Usuario.query.all()
        total_usuarios = Usuario.query.count()
        app.logger.debug(f'Listado usuarios: {usuario}')
        app.logger.debug(f'Total usuarios: {total_usuarios}')
        return render_template('personas.html', usuarios=usuario, total_usuarios=total_usuarios)
    return redirect(url_for('login'))


@app.route('/ver/<int:id>')
def ver_detalle(id):
    usuario = Usuario.query.get_or_404(id)
    app.logger.debug(f'Ver persona:{usuario}')
    return render_template('detalle.html', usuario=usuario)
