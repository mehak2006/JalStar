import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_alert_email(recipient_email: str, water_level: float):
    # Email configuration
    sender_email = "your-email@gmail.com"  # Replace with your email
    sender_password = "your-app-password"   # Replace with your app password
    
    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = "⚠ Ground Water Level Alert - DWLR Station"
    
    # Email body
    body = f"""
    ⚠ GROUND WATER LEVEL ALERT

    The groundwater level at your nearest DWLR station has reached a critical level:
    Current Level: {abs(water_level):.2f} meters below ground

    This is below the threshold value of 9 meters. 
    
    Recommended Actions:
    - Please reduce your groundwater usage
    - Consider water conservation methods
    - Monitor water consumption
    
    This is an automated alert from your local DWLR monitoring system.
    """
    
    message.attach(MIMEText(body, "plain"))
    
    try:
        # Create secure SSL/TLS connection
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        
        # Send email
        server.send_message(message)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False