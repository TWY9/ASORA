"""
ASORA — Run the Flask application.
"""
from app import create_app, db
from app.models import *  # noqa: F401,F403 — Import all models for migrations

app = create_app()


@app.cli.command('init-db')
def init_db():
    """Create all database tables."""
    with app.app_context():
        db.create_all()
        print('[OK] Base de datos creada exitosamente.')


@app.cli.command('seed')
def seed_data():
    """Seed the database with ISC subjects and test users."""
    from app.models.subject import Subject
    from app.models.user import User
    import bcrypt

    with app.app_context():
        # Check if already seeded
        if Subject.query.first():
            print('[!]  La base de datos ya tiene datos. Usa "flask reset-db" primero.')
            return

        # === ISC Subjects (Retícula básica) ===
        isc_subjects = [
            # Semester 1
            ('Cálculo Diferencial', 'AEF-1003', 1, 'ciencias básicas'),
            ('Fundamentos de Programación', 'SCD-1008', 1, 'programación'),
            ('Taller de Ética', 'ACA-0907', 1, 'social'),
            ('Matemáticas Discretas', 'AEF-1041', 1, 'ciencias básicas'),
            # Semester 2
            ('Cálculo Integral', 'AEF-1004', 2, 'ciencias básicas'),
            ('Programación Orientada a Objetos', 'SCD-1020', 2, 'programación'),
            ('Química', 'AEF-1058', 2, 'ciencias básicas'),
            ('Contabilidad Financiera', 'AEC-1008', 2, 'administración'),
            ('Álgebra Lineal', 'AEF-1002', 2, 'ciencias básicas'),
            # Semester 3
            ('Cálculo Vectorial', 'AEF-1005', 3, 'ciencias básicas'),
            ('Estructura de Datos', 'SCD-1007', 3, 'programación'),
            ('Probabilidad y Estadística', 'AEF-1053', 3, 'ciencias básicas'),
            ('Física General', 'AEF-1023', 3, 'ciencias básicas'),
            ('Cultura Empresarial', 'SCD-1005', 3, 'administración'),
            # Semester 4
            ('Métodos Numéricos', 'SCC-1017', 4, 'ciencias básicas'),
            ('Topicos Avanzados de Programación', 'SCD-1027', 4, 'programación'),
            ('Principios Eléctricos y Aplic. Digitales', 'SCD-1018', 4, 'ingeniería'),
            ('Fundamentos de Bases de Datos', 'SCD-1009', 4, 'programación'),
            ('Sistemas Operativos', 'SCD-1025', 4, 'ingeniería'),
            # Semester 5
            ('Graficación', 'SCC-1010', 5, 'programación'),
            ('Fundamentos de Telecomunicaciones', 'SCD-1012', 5, 'redes'),
            ('Taller de Bases de Datos', 'SCD-1026', 5, 'programación'),
            ('Simulación', 'SCC-1021', 5, 'ingeniería'),
            ('Investigación de Operaciones', 'SCC-1013', 5, 'ingeniería'),
            # Semester 6
            ('Redes de Computadoras', 'SCD-1021', 6, 'redes'),
            ('Lenguajes y Autómatas I', 'SCC-1015', 6, 'programación'),
            ('Ingeniería de Software', 'SCC-1012', 6, 'ingeniería'),
            ('Inteligencia Artificial', 'SCC-1012', 6, 'programación'),
            ('Administración de Bases de Datos', 'SCB-1001', 6, 'programación'),
            # Semester 7
            ('Programación Web', 'SCC-1019', 7, 'programación'),
            ('Conmutación y Enrutamiento de Redes', 'SCD-1004', 7, 'redes'),
            ('Lenguajes y Autómatas II', 'SCC-1016', 7, 'programación'),
            ('Gestión de Proyectos de Software', 'SCD-1013', 7, 'ingeniería'),
            # Semester 8
            ('Programación Lógica y Funcional', 'SCC-1018', 8, 'programación'),
            ('Taller de Investigación I', 'ACA-0909', 8, 'investigación'),
            ('Arquitectura de Computadoras', 'SCD-1003', 8, 'ingeniería'),
            # Semester 9
            ('Taller de Investigación II', 'ACA-0910', 9, 'investigación'),
            ('Residencia Profesional', '', 9, 'profesional'),
        ]

        career = 'Ingeniería en Sistemas Computacionales'
        for name, code, sem, cat in isc_subjects:
            subject = Subject(name=name, code=code, semester=sem, career=career, category=cat)
            db.session.add(subject)

        # === Test Users ===
        test_password = bcrypt.hashpw('asora123'.encode(), bcrypt.gensalt()).decode()

        users_data = [
            ('admin001', 'Administrador Principal', 'Sistemas', 1, 'admin'),
            ('23120532', 'Natalia Guadalupe Corona Camarena', career, 6, 'both'),
            ('23120524', 'Marco Antonio Vázquez Ponce', career, 6, 'both'),
            ('21120100', 'Carlos Hernández López', career, 8, 'asesor'),
            ('22120200', 'María García Pérez', career, 7, 'asesor'),
            ('24120300', 'Ana Sofía Ramírez Torres', career, 4, 'asesorado'),
            ('24120400', 'Luis Ángel Morales Díaz', career, 3, 'asesorado'),
        ]

        for ctrl, name, car, sem, role in users_data:
            user = User(
                control_number=ctrl,
                password_hash=test_password,
                full_name=name,
                career=car,
                semester=sem,
                role=role,
            )
            db.session.add(user)

        db.session.commit()
        print(f'[OK] Seed completado: {len(isc_subjects)} materias + {len(users_data)} usuarios de prueba')
        print(f'   Contraseña de prueba: asora123')


@app.cli.command('reset-db')
def reset_db():
    """Drop and recreate all tables."""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print('[OK] Base de datos reiniciada.')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
