<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 15px;
        }
        .content {
            padding: 30px 20px;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #2563eb;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .help-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PERA FIN CORE</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }},</h2>
            <p>Thank you for registering with PERA FIN CORE. Please verify your email address to complete your registration and access all features of our financial management platform.</p>
            
            <div style="text-align: center;">
                <a href="{{ $url }}" class="button">Verify Email Address</a>
            </div>
            
            <p>This verification link will expire in 60 minutes.</p>
            
            <p>If you did not create an account, no further action is required.</p>
            
            <div class="help-text">
                <p>If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser:</p>
                <p style="word-break: break-all; color: #4b5563;">{{ $url }}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} PERA FIN CORE. All rights reserved.</p>
            <p>Your personal finance management solution</p>
        </div>
    </div>
</body>
</html>