from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(50), nullable=True)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    @classmethod
    def create(cls, email, password, username=None, name=None, last_name=None, is_active=True):
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = cls(
            email=email,
            password=hashed_password,
            username=username,
            name=name,
            last_name=last_name,
            is_active=is_active
        )
        db.session.add(user)
        db.session.commit()
        return user
    
    @classmethod
    def find_by_email(cls, email):
        return db.session.execute(
            db.select(cls).where(cls.email == email)
        ).scalar_one_or_none()
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "name": self.name,
            "last_name": self.last_name,
        }
