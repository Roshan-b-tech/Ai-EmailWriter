# AI Email Writer

A modern web application that generates professional emails using AI and sends them via email. Built with React, Node.js, and powered by Groq's AI API.

## ✨ Features

- 🤖 **AI-Powered Email Generation**: Uses Groq's llama3-8b-8192 model to generate professional emails
- 👥 **Multiple Recipients**: Add multiple recipients with names and email addresses
- ✏️ **Edit Before Sending**: Edit generated emails before sending
- 📧 **Email Sending**: Send emails via Gmail SMTP using Nodemailer
- 🎨 **Modern UI**: Beautiful React interface with Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Generation**: Instant email generation with loading states

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Groq SDK** - AI API integration
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gmail account with App Password
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Ai-EmailWriter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Groq API Configuration
   GROQ_API_KEY=gsk_your_groq_api_key_here
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # Server Configuration
   PORT=3001
   ```

4. **Get your API keys**
   
   - **Groq API Key**: Sign up at [console.groq.com](https://console.groq.com/) and get your API key
   - **Gmail App Password**: 
     - Enable 2-factor authentication on your Gmail account
     - Go to [Google Account Settings](https://myaccount.google.com/apppasswords)
     - Generate an app password for "Mail"

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173/`

## 📖 Usage

### Adding Recipients
1. Enter the recipient's name (optional) and email address
2. Click "Add Recipient" or press Enter
3. Add multiple recipients as needed

### Generating Emails
1. Enter a prompt describing the email you want to generate
   - Example: "Write a professional follow-up email for a job interview"
   - Example: "Create a thank you email after a business meeting"
2. Click "Generate Email"
3. The AI will create a professional email with subject and content

### Editing and Sending
1. Review the generated email
2. Click "Edit" to modify subject or content
3. Click "Save" to apply changes
4. Click "Send to X recipient(s)" to send the email

## 🔧 API Endpoints

### Generate Email
```
POST /api/generate-email
Content-Type: application/json

{
  "prompt": "Write a professional email for..."
}
```

### Send Emails
```
POST /api/send-emails
Content-Type: application/json

{
  "recipients": [
    {"email": "user@example.com", "name": "John Doe"}
  ],
  "subject": "Email Subject",
  "content": "Email content..."
}
```

### Health Check
```
GET /api/health
```

## 🏗️ Project Structure

```
Ai-EmailWriter/
├── src/
│   ├── App.tsx          # Main React component
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite types
├── server.js            # Express server
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── .env                 # Environment variables (create this)
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |
| `EMAIL_USER` | Your Gmail address | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `PORT` | Server port (default: 3001) | No |

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify your Groq API key is correct
   - Check that the API key is properly set in `.env`

2. **Email Sending Fails**
   - Ensure you're using an App Password, not your regular Gmail password
   - Verify 2-factor authentication is enabled on your Gmail account
   - Check that `EMAIL_USER` and `EMAIL_PASS` are correct

3. **Port Already in Use**
   - Change the `PORT` in your `.env` file
   - Or kill existing Node.js processes

4. **CORS Errors**
   - Ensure the Vite proxy is configured correctly in `vite.config.ts`
   - Check that both frontend and backend are running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing the AI API
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you encounter any issues or have questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Ensure all environment variables are properly configured

---

**Made with ❤️ using React, Node.js, and Groq AI**