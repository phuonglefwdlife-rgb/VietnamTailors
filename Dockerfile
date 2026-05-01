{
  "name": "vietnamtailors",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "tsc && vite build",
    "start": "vite preview --port 3000 --host 0.0.0.0",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/generativeai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^4.3.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.454.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-dropzone": "^14.3.0",
    "tailwind-merge": "^3.0.0",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "eslint": "^8.57.0",
    "typescript": "^5.2.2"
  }
}
