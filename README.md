# Emoji Hand - AI Emoji Translator & Generator

Emoji Hand is the ultimate AI-powered emoji translator and generator. Transform any text into expressive emoji messages instantly. Free emoji translation, TikTok emojis, emoji packs, and more!

## 🚀 Features

- **AI-Powered Translation**: Convert text to emojis using advanced AI
- **Multi-language Support**: English, Chinese, Korean, Japanese, Spanish, French, Portuguese, German, Italian, Russian
- **TikTok Emojis**: Specialized emoji sets for TikTok content
- **Emoji Packs**: Curated collections for different use cases
- **Real-time Generation**: Instant emoji creation
- **User Authentication**: Secure login and profile management
- **Subscription System**: Premium features and credit system

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Email**: Resend
- **Internationalization**: i18next
- **State Management**: TanStack Query (React Query)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/emoji-hand.git
   cd emoji-hand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/emojihand"

# Authentication
AUTH_SECRET="your-auth-secret-here"
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio

## 🐛 Troubleshooting

### Common Issues

1. **ESLint Configuration Errors**
   - Run `npm run lint` to check for issues
   - Ensure all dependencies are properly installed

2. **TypeScript Errors**
   - Run `npm run typecheck` to identify type issues
   - Check for missing type annotations

3. **Database Connection Issues**
   - Verify DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Run `npm run db:generate` to regenerate Prisma client

4. **Build Failures**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Performance Issues

- Check for unnecessary re-renders in React components
- Optimize image loading and lazy loading
- Monitor bundle size with `npm run build`

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── [locale]/       # Internationalized routes
│   ├── api/            # API routes
│   └── components/     # Shared components
├── components/         # Legacy components
├── config/            # Configuration files
├── server/            # Server-side utilities
├── trpc/              # tRPC configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information
4. Contact the development team

## 🔄 Recent Updates

- Fixed ESLint configuration issues
- Optimized component performance
- Enhanced internationalization support
- Improved error handling and type safety
- Added comprehensive documentation 