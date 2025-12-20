# 📸 Photo Album - Full Stack Application

Full-stack web application to manage a photo gallery with albums, favorites, and cloud storage capabilities.

## 🚀 Features

- **Image Management**: Upload, view, and delete photos
- **Custom Albums**: Organize your photos into thematic albums
- **Favorites**: Mark your favorite photos for quick access
- **Modal Gallery**: Full-screen image viewing with navigation
- **Cloud Storage**: Cloudinary integration
- **Responsive Design**: Interface adapts to all devices
- **Performance Optimization**: Lazy loading and CLS optimization

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **React Router 7** for navigation
- **TanStack Query** (React Query) for state management and caching
- **Vite** as bundler
- **CSS Modules** for styling

### Backend

- **Node.js** with Express
- **TypeScript** for static typing
- **MongoDB** with Mongoose for database
- **Cloudinary** for image storage
- **Multer** for upload handling
- **Vitest** for testing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository>
cd updated_photoalbum
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in the `server` folder:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=photo-album
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Create `.env` file in the `client` folder (if needed):

```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

- Live Frontend: https://photoalbum-frontend.onrender.com

### Production Mode

**Backend:**

```bash
cd server
npm run build
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

## 🧪 Testing

The project includes unit and integration tests:

```bash
cd server

# Run tests
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
updated_photoalbum/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # API services
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Pages/views
│   │   ├── queryOptions/  # React Query configuration
│   │   └── types.ts       # TypeScript types
│   └── package.json
│
└── server/                # Node.js Backend
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Mongoose models
    │   ├── routes/        # Route definitions
    │   ├── services/      # Business logic
    │   ├── middleware/    # Custom middleware
    │   ├── libs/          # Libraries and configurations
    │   └── test/          # Tests
    └── package.json
```

## 🔌 API Endpoints

### Images

- `GET /api/images` - Get all images
- `GET /api/images?page=1&limit=12` - Pagination
- `POST /api/images` - Upload new image
- `DELETE /api/images/:id` - Delete image
- `PATCH /api/images/:id/favourite` - Toggle favorite
- `PATCH /api/images/:id/add-to-album` - Add to album

### Albums

- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get specific album
- `POST /api/albums` - Create new album
- `DELETE /api/albums/:id` - Delete album

## 🎨 UI/UX Features

- **Smooth animations**: CSS transitions and hover effects
- **Gallery modal**: Image navigation with keyboard support
- **Informative tooltips**: Contextual help on icons
- **Lazy loading**: Deferred image loading
- **CLS optimization**: Core Web Vitals improvements
- **Modular design**: Encapsulated styles with CSS Modules

## 📊 Optimizations

- Intelligent caching with TanStack Query
- Automatic query invalidation
- Image lazy loading
- Bundle optimization with Vite
- Minimized re-renders
- Strict typing with TypeScript

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the ISC License.

## 👤 Author

## 🔗 Live Demo

- Frontend (live): https://photoalbum-frontend.onrender.com

Sonia - [https://github.com/soniahiltner]

- Live demo: https://photoalbum-frontend.onrender.com

## 🙏 Acknowledgments

- Cloudinary for image storage
- TanStack Query for excellent state management
- The React and TypeScript community

---

⭐ If you like this project, give it a star on GitHub!
