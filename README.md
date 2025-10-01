# Photon Coaching Clone

This is a complete clone of the [photoncoaching.in](http://photoncoaching.in) website built with modern web technologies.

## Technology Stack

- **Frontend**: Tailwind CSS, EJS templates
- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: Turso (SQLite-based database)
- **Deployment**: Can be deployed to any Node.js hosting platform

## Features

1. **Responsive Design**: Mobile-friendly layout using Tailwind CSS
2. **Multiple Pages**:
   - Home page with all sections from the original site
   - Courses page with detailed course information
   - Student corner for resources
   - Faculty dashboard
   - Contact page with inquiry form
3. **Database Integration**: 
   - Student inquiries stored in Turso database
   - Course information management
   - Testimonials and faculty information
4. **Contact Form**: Functional contact form that stores inquiries in the database

## Project Structure

```
photon-coaching-clone/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── views/
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── database.ts
│   └── server.ts
├── dist/
├── node_modules/
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd photon-coaching-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Turso Database**:
   - Sign up for a free account at [Turso.tech](https://turso.tech)
   - Create a new database
   - Update the database URL and auth token in [src/database.ts](file:///C:/Users/HP/Documents/gpt-pilot/workspace/photon-coaching-clone/src/database.ts)

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

6. **Development mode**:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following tables:

1. **students**: Stores student inquiries from the contact form
2. **courses**: Contains course information
3. **faculty**: Information about teaching faculty
4. **testimonials**: Student testimonials

## Seeding Initial Data

To populate the database with sample data:

```bash
npx ts-node src/seed.ts
```

## Customization

You can customize the following aspects:

1. **Content**: Update the EJS templates in [src/views/](file:///C:/Users/HP/Documents/gpt-pilot/workspace/photon-coaching-clone/src/views/)
2. **Styling**: Modify [src/public/css/style.css](file:///C:/Users/HP/Documents/gpt-pilot/workspace/photon-coaching-clone/src/public/css/style.css)
3. **Scripts**: Update [src/public/js/main.js](file:///C:/Users/HP/Documents/gpt-pilot/workspace/photon-coaching-clone/src/public/js/main.js)
4. **Database**: Modify schema in [src/database.ts](file:///C:/Users/HP/Documents/gpt-pilot/workspace/photon-coaching-clone/src/database.ts)

## Deployment

This application can be deployed to any platform that supports Node.js applications, such as:

- Vercel
- Render
- Heroku
- DigitalOcean App Platform
- Any VPS with Node.js support

For deployment, make sure to set the following environment variables:

- `PORT`: Port number for the application (default: 3000)

## License

This project is a clone/replica of the photoncoaching.in website and is intended for educational purposes only.