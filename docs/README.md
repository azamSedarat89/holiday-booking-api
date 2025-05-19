<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Holiday Booking API</h1>
<p align="center">A RESTful API built with NestJS, PostgreSQL, and TypeORM for managing holiday reservations and user authentication.</p>

<hr />

<h2>📦 Tech Stack</h2>
<ul>
  <li><strong>Framework:</strong> <a href="https://nestjs.com/">NestJS</a></li>
  <li><strong>Language:</strong> TypeScript</li>
  <li><strong>Database:</strong> PostgreSQL</li>
  <li><strong>ORM:</strong> TypeORM</li>
  <li><strong>Authentication:</strong> JWT</li>
  <li><strong>Validation:</strong> Joi</li>
  <li><strong>Hashing:</strong> bcrypt</li>
  <li><strong>Environment Management:</strong> dotenv</li>
  <li><strong>Testing:</strong> Jest</li>
</ul>

<hr />

<h2>🚀 Getting Started</h2>

<h3>1. Install dependencies</h3>
<pre><code>npm install
</code></pre>

<h3>2. Set up environment variables</h3>
<p>Create a <code>.env</code> file in the root and configure your environment variables like:</p>
<pre><code>PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=holiday_booking
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
</code></pre>

<h3>3. Run the application</h3>
<pre><code># Development
npm run start:dev

# Production
npm run start:prod
</code></pre>

<hr />

<h2>🔑 Default Admin User Seeding</h2>
<p>When the application starts, it automatically checks for a default admin user. If the admin user does not exist, it seeds one with the following credentials:</p>
<ul>
  <li><strong>Email:</strong> <code>admin@example.com</code></li>
  <li><strong>Password:</strong> <code>adminPassword123</code></li>
</ul>
<p>You can find and customize this seeding logic inside the <code>AdminSeederService</code> (registered in the <code>AuthModule</code>). The password is securely hashed using bcrypt before being saved to the database.</p>
<p><strong>Note:</strong> Make sure to change the default credentials before deploying to production for security purposes.</p>

<hr />

<h2>🧪 Running Tests</h2>
<pre><code># Unit tests
npm run test
</code></pre>

<hr />

<h2>🧱 Project Structure</h2>
<pre><code>src/
├── auth/              → Authentication logic (JWT)  
├── users/             → User entity, service, controller  
├── bookings/          → Booking logic for holidays  
├── payment/           → Payment handling (e.g., service)  
├── database/          → TypeORM configuration  
├── common/            → decorators, interfaces  
├── doc/               → Project documentation  
│   ├── sequence/          → Sequence diagrams (*.drawio, *.png)  
│   ├── auth-flow/         → Auth flow charts (*.drawio, *.png)  
│   ├── architecture/      → High-level architecture diagrams (*.drawio, *.png)  
│   └── erd/               → Entity-Relationship diagrams (*.drawio, *.png)  
├── app.module.ts      → Root module  
├── main.ts            → Entry point  
</code></pre>

<hr />

<h2>📄 License</h2>
<p>This project is [UNLICENSED]. For internal use only.</p>
