import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()  

def connect():
    database = os.getenv("PG_DATABASE")
    user = os.getenv("PG_USER")
    password = os.getenv("PG_PASSWORD")
    host = os.getenv("PG_HOST")
    port = os.getenv("PG_PORT")
    conn = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
    return conn
