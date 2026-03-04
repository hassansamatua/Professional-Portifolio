import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email templates
const userConfirmationTemplate = (name: string, subject: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting Hansco Dev</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .content {
            margin-bottom: 30px;
        }
        .highlight {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Hansco Dev</div>
            <h1>Thank You for Reaching Out! 🎉</h1>
        </div>
        
        <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for contacting me about <strong>${subject}</strong>. I've received your message and I'm excited to learn more about your project!</p>
            
            <div class="highlight">
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>I'll review your message carefully</li>
                    <li>You'll receive a personalized response within 1-2 business days</li>
                    <li>We can schedule a call if needed to discuss your project in detail</li>
                </ul>
            </div>
            
            <p>While you wait, feel free to check out my <a href="https://hanscodev.com/projects" style="color: #10b981;">portfolio</a> to see some of my recent work.</p>
            
            <p>If you have any urgent questions, don't hesitate to reach out directly.</p>
            
            <div style="text-align: center;">
                <a href="https://hanscodev.com" class="btn">Visit My Website</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Hansco Dev</strong><br>
            Developer • Designer • Teacher<br>
            <a href="mailto:hanscodev@gmail.com" style="color: #10b981;">hanscodev@gmail.com</a></p>
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent because you contacted Hansco Dev through the website contact form.
            </p>
        </div>
    </div>
</body>
</html>
`;

const adminNotificationTemplate = (message: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message - Hansco Dev</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .alert {
            background-color: #dbeafe;
            border: 1px solid #3b82f6;
            color: #1e40af;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .message-details {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .field {
            margin-bottom: 15px;
        }
        .field-label {
            font-weight: bold;
            color: #64748b;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .field-value {
            margin-top: 5px;
            padding: 10px;
            background-color: white;
            border-radius: 3px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .attachments {
            margin-top: 10px;
        }
        .attachment {
            display: inline-block;
            background-color: #f1f5f9;
            padding: 5px 10px;
            border-radius: 3px;
            margin: 2px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Contact Message</h1>
        </div>
        
        <div class="alert">
            <strong>You have a new contact message!</strong> Someone has reached out through your website contact form.
        </div>
        
        <div class="message-details">
            <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">
                    <strong>${message.name}</strong><br>
                    <a href="mailto:${message.email}" style="color: #3b82f6;">${message.email}</a>
                </div>
            </div>
            
            <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${message.subject}</div>
            </div>
            
            <div class="field">
                <div class="field-label">Message</div>
                <div class="field-value" style="white-space: pre-wrap;">${message.message}</div>
            </div>
            
            ${message.attachments && message.attachments.length > 0 ? `
            <div class="field">
                <div class="field-label">Attachments</div>
                <div class="attachments">
                    ${message.attachments.map((att: any) => 
                        `<div class="attachment">📎 ${att.name} (${(att.size / 1024 / 1024).toFixed(2)} MB)</div>`
                    ).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="field">
                <div class="field-label">Received</div>
                <div class="field-value">${new Date(message.created_at).toLocaleString()}</div>
            </div>
        </div>
        
        <div style="text-align: center;">
            <a href="https://hanscodev.com/admin/contact" class="btn">View in Admin Panel</a>
            <a href="mailto:${message.email}" class="btn">Reply via Email</a>
        </div>
    </div>
</body>
</html>
`;

const replyTemplate = (userEmail: string, userName: string, subject: string, reply: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Response from Hansco Dev</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .reply-content {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Hansco Dev</div>
            <h1>Response to Your Inquiry</h1>
        </div>
        
        <p>Hi ${userName},</p>
        
        <p>Thank you for your patience! I've reviewed your message about <strong>${subject}</strong> and here's my response:</p>
        
        <div class="reply-content">${reply}</div>
        
        <p>If you have any follow-up questions or need clarification on anything, please don't hesitate to reply to this email.</p>
        
        <p>I look forward to potentially working together!</p>
        
        <div class="footer">
            <p><strong>Hansco Dev</strong><br>
            Developer • Designer • Teacher<br>
            <a href="mailto:hanscodev@gmail.com" style="color: #10b981;">hanscodev@gmail.com</a></p>
        </div>
    </div>
</body>
</html>
`;

// Create transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, subject, data } = body;

    const transporter = createTransporter();
    
    let mailOptions: any = {
      from: process.env.SMTP_USER || 'hanscodev@gmail.com',
      to,
      subject,
    };

    switch (type) {
      case 'user_confirmation':
        mailOptions.html = userConfirmationTemplate(data.name, data.subject);
        break;
      case 'admin_notification':
        mailOptions.html = adminNotificationTemplate(data);
        break;
      case 'admin_reply':
        mailOptions.html = replyTemplate(data.email, data.name, data.subject, data.reply);
        break;
      default:
        throw new Error('Invalid email type');
    }

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
