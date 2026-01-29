"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/hello/private', methods=['POST', 'GET'])
@jwt_required()
def handle_hello_private():
    user_id = get_jwt_identity()

    user = db.session.get(User,user_id)


    response_body = {
        "message": "Mensaje privado",
        "user": user.to_dict()
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.find_by_email(data.get('email'))

    if not user:
        return jsonify({
            "error": True,
            "message": "Verifica los datos ingresados"
        }),400

    if user.check_password(data.get("password")):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "user": user.to_dict(),
            "access_token": access_token
        })

    return jsonify({
        "error": True,
        "message": "Verifica los datos ingresados"
    }),400

    print(user)

    return "Ok"


# @api.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     user = User.create(
#         email=data.get('email'),
#         password=data.get('password')
#     )

#     print(user)

#     print(f"user es -->{user}")

#     return jsonify(user.to_dict())

# from flask_jwt_extended import create_access_token

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Revisar si el email ya existe
    if User.find_by_email(data.get("email")):
        return jsonify({
            "error": True,
            "message": "El email ya está registrado"
        }), 400

    # Crear usuario usando tu método create
    user = User.create(
        email=data.get("email"),
        password=data.get("password"),
        username=data.get("username"),
        name=data.get("name"),
        last_name=data.get("last_name")
    )

    # Generar token JWT automáticamente
    access_token = create_access_token(identity=str(user.id))

    # Devolver usuario + token
    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token
    }), 201
