
<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Holiday Booking API</h1>
<p align="center">A RESTful API built with NestJS, PostgreSQL, and TypeORM for managing holiday reservations and user authentication.</p>

---

## 📦 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT + Passport
- **Validation:** Joi
- **Hashing:** bcrypt
- **Environment Management:** dotenv
- **Testing:** Jest, Supertest

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root and configure your environment variables like:

```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/holiday_db
JWT_SECRET=your-secret-key
```

### 3. Run the application

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🧱 Project Structure

```
src/
├── auth/              → Authentication logic (JWT, Passport)
├── users/             → User entity, service, controller
├── bookings/          → Booking logic for holidays
├── database/          → TypeORM configuration
├── common/            → DTOs, guards, interceptors
├── app.module.ts      → Root module
├── main.ts            → Entry point
```

---

## 📄 License

This project is [UNLICENSED]. For internal use only.