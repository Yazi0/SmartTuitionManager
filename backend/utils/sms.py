from django.conf import settings
from twilio.rest import Client

def send_sms(to_phone, message):
    if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_PHONE_NUMBER]):
        print(f"Twilio not configured. Would send SMS to {to_phone}: {message}")
        return False
    
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        
        return True
    except Exception as e:
        print(f"Failed to send SMS: {str(e)}")
        return False

def send_attendance_sms(student, class_name):
    message = f"Your child {student.full_name} has arrived for {class_name}."
    return send_sms(student.parent_phone, message)

def send_payment_sms(student, month, year):
    message = f"Your child's class fee for {month.capitalize()} {year} has been received."
    return send_sms(student.parent_phone, message)
