from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

# Configuração inicial
SECRET_KEY = "sua_chave_secreta_super_segura_aqui"  # Em produção, use variáveis de ambiente
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="API de Autenticação - Landing Page")

# Configuração de CORS para permitir requisições do React (geralmente na porta 5173 ou 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulação de Banco de Dados em memória (substitua por PostgreSQL/MongoDB em produção)
fake_users_db = {}


class UserCreate(BaseModel):
  email: EmailStr
  password: str


class UserLogin(BaseModel):
  email: EmailStr
  password: str


class Token(BaseModel):
  access_token: str
  token_type: str


def get_password_hash(password):
  return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
  return pwd_context.verify(plain_password, hashed_password)


@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate):
  if user.email in fake_users_db:
    raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
  hashed_password = get_password_hash(user.password)
  fake_users_db[user.email] = {
      "email": user.email,
      "hashed_password": hashed_password,
  }
  return {"message": "Usuário registrado com sucesso!"}


@app.post("/api/login", response_model=Token)
def login(user: UserLogin):
  db_user = fake_users_db.get(user.email)
  if not db_user or not verify_password(
      user.password, db_user["hashed_password"]
  ):
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="E-mail ou senha incorretos",
        headers={"WWW-Authenticate": "Bearer"},
    )

  # Criando o token JWT de acesso
  expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  to_encode = {"sub": user.email, "exp": expire}
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

  return {"access_token": encoded_jwt, "token_type": "bearer"}