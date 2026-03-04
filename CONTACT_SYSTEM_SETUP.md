# Contact System Setup Guide

## Overview
This comprehensive contact system includes:
- ✅ Contact form with file attachments
- ✅ Admin panel for message management
- ✅ Email notifications with HTML templates
- ✅ Rate limiting and captcha protection
- ✅ Real-time WebSocket updates
- ✅ Admin notification system
- ✅ Message status tracking (Pending/Replied/Archived)

## Database Setup

### 1. Run the Migration
Execute the SQL migration in your Supabase database:

```sql
-- File: supabase/migrations/20240101000000_create_contact_messages.sql
```

This creates the `contact_messages` table with:
- Message details (name, email, subject, message)
- File attachments (JSONB)
- Status tracking
- Admin replies
- Row Level Security (RLS)

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# Email Configuration (for nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email
ADMIN_EMAIL=your-email@gmail.com

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Email Setup

### Gmail Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use the app password in `SMTP_PASS`

### Alternative Email Services
You can use any SMTP service by updating the SMTP configuration in `lib/email.ts`.

## Features

### Contact Form (`/contact`)
- **Fields**: Name, Email, Subject, Message, File Attachments
- **File Support**: PDF, DOC, DOCX, TXT, Images (JPG, PNG, GIF)
- **File Limits**: Max 5 files, 10MB each
- **Captcha**: Simple math captcha (7 + 3 = ?)
- **Rate Limiting**: 5 submissions per 15 minutes per IP
- **Email Confirmation**: Automatic email sent to user

### Admin Panel (`/admin/contact`)
- **Message Management**: View, reply, archive, delete messages
- **Real-time Updates**: WebSocket notifications for new messages
- **Search & Filter**: By status, search by content
- **Direct Reply**: Send replies directly to user email
- **Status Tracking**: Pending → Replied → Archived
- **Notification Bell**: Real-time notification system

### Email Templates

#### User Confirmation Email
- Professional HTML template
- Includes project information
- Response time expectations
- Portfolio link

#### Admin Notification Email
- Immediate notification of new messages
- Full message details
- Quick action links
- Attachment information

#### Admin Reply Email
- Professional reply template
- Preserves conversation context
- Contact information

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get messages (admin only)

### File Upload
- `POST /api/upload` - Upload file attachments
- `DELETE /api/upload` - Delete uploaded files

### Admin Management
- `GET /api/admin/contact` - Get messages with pagination
- `PATCH /api/admin/contact` - Update message status/reply
- `DELETE /api/admin/contact` - Delete message

## Security Features

### Rate Limiting
- 5 submissions per 15 minutes per IP
- Configurable limits in `lib/rate-limit.ts`

### Captcha Protection
- Simple math captcha to prevent bots
- Easy to implement more advanced solutions

### Row Level Security (RLS)
- Only authenticated admins can view/manage messages
- Public can only insert messages
- Email-based admin verification

### File Upload Security
- File type validation
- Size limits
- Secure filename generation
- Path traversal prevention

## Real-time Features

### WebSocket Integration
- Real-time notifications for new messages
- Automatic message list updates
- Connection management with reconnection

### Notification System
- Browser notifications
- Visual notification bell with unread count
- Persistent notification storage
- Mark as read/unread functionality

## Customization

### Email Templates
Edit templates in `lib/email.ts`:
- `userConfirmationTemplate` - User confirmation email
- `adminNotificationTemplate` - Admin notification email
- `replyTemplate` - Admin reply email

### Captcha
Update the captcha in `app/contact/page.tsx`:
- Change the math problem
- Implement reCAPTCHA or other solutions

### Rate Limiting
Modify limits in `lib/rate-limit.ts`:
- Adjust window time
- Change request limits
- Add custom logic

## Testing

### Contact Form Testing
1. Navigate to `/contact`
2. Fill out all required fields
3. Test file uploads (optional)
4. Solve the captcha (answer: 10)
5. Submit and check for confirmation email

### Admin Panel Testing
1. Login as admin
2. Navigate to `/admin/contact`
3. View message list
4. Click on a message to view details
5. Send a reply
6. Check status updates

### Real-time Testing
1. Open admin panel in two tabs
2. Submit a new contact form
3. Verify real-time notification
4. Check message list updates

## Troubleshooting

### Email Not Sending
- Check SMTP credentials
- Verify app password for Gmail
- Check email service provider settings

### Database Errors
- Run the migration script
- Verify Supabase connection
- Check RLS policies

### File Upload Issues
- Check `public/uploads` directory permissions
- Verify file size limits
- Check allowed file types

### WebSocket Not Working
- Check browser console for errors
- Verify WebSocket server setup
- Check firewall/proxy settings

## Production Considerations

### Email Service
- Use a dedicated email service (SendGrid, Mailgun)
- Set up email domain verification
- Configure SPF/DKIM records

### File Storage
- Use cloud storage (AWS S3, Cloudinary)
- Implement CDN for file delivery
- Set up file expiration policies

### Security
- Implement advanced captcha (reCAPTCHA)
- Add CSRF protection
- Set up monitoring and logging

### Performance
- Add database indexes
- Implement caching
- Optimize email delivery

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Verify environment configuration
4. Check browser console for errors
