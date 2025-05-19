
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
- **Authentication:** JWT
- **Validation:** Joi
- **Hashing:** bcrypt
- **Environment Management:** dotenv
- **Testing:** Jest

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
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=holiday_booking
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

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
```

---

## 🧱 Project Structure

```
src/
├── auth/              → Authentication logic (JWT)
├── users/             → User entity, service, controller
├── bookings/          → Booking logic for holidays
├── payment/           → Payment handling (e.g., service)
├── database/          → TypeORM configuration
├── common/            → decorators, interface
├── doc/               → Project documentation
│   ├── sequence/          → Sequence diagrams (*.drawio, *.png)
│   ├── auth-flow/         → Auth flow charts (*.drawio, *.png)
│   ├── architecture/      → High-level architecture diagrams (*.drawio, *.png)
│   └── erd/               → Entity-Relationship diagrams (*.drawio, *.png)
├── app.module.ts      → Root module
├── main.ts            → Entry point


```

---

## 📄 License

This project is [UNLICENSED]. For internal use only.