# backend/services/email_service.py
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "alerts@example.com")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")


def send_email(to: str, subject: str, plain_text: str, html: str = None):
    """
    Send an email to 'to' with given subject and plain_text (and optional html).
    Returns (success: bool, response: str)
    """
    # ---- Try SendGrid first ----
    if SENDGRID_API_KEY:
        try:
            message = Mail(
                from_email=EMAIL_FROM,
                to_emails=to,
                subject=subject,
                plain_text_content=plain_text,
                html_content=html or f"<pre>{plain_text}</pre>",
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            response = sg.send(message)
            return True, f"SendGrid status {response.status_code}"
        except Exception as e:
            return False, f"SendGrid error: {e}"

    # ---- Fallback: SMTP ----
    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = EMAIL_FROM
            msg["To"] = to

            part1 = MIMEText(plain_text, "plain")
            msg.attach(part1)
            if html:
                part2 = MIMEText(html, "html")
                msg.attach(part2)

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(EMAIL_FROM, [to], msg.as_string())

            return True, "SMTP send success"
        except Exception as e:
            return False, f"SMTP error: {e}"

    # ---- No provider configured ----
    return False, "No email provider configured"
