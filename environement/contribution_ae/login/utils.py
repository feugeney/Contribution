from collections import namedtuple
import random
import string
from datetime import datetime
from django.conf import settings
from django.utils.crypto import get_random_string

                  
def generate_random_text(length):
    source = string.ascii_letters + string.digits
    result = ''.join( (random.choice(source)) for i in range(length))
    return result.upper()

def nbre_minute_ecoulee(date_value):
    delta = datetime.utcnow().replace(tzinfo=utc) - date_value
    return round(delta.total_seconds()/60)

def get_random_alphanumeric_string(length):
   letters_and_digits = string.digits + string.ascii_letters 
   result_str = ''.join(random.choice(letters_and_digits) for i in range(length))
   return result_str.upper()
  
# def tuplefetchall(cursor):
#     "Return all rows from a cursor as a namedtuple"
#     desc = cursor.description
#     nt_result = namedtuple('Result', [col[0].lower() for col in desc])
#     return [nt_result(*row) for row in cursor.fetchall()]