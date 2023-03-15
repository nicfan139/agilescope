# AgileScope server

Back-end API built using a core of [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) + [Mongoose](https://mongoosejs.com/) + [MongoDB](https://www.mongodb.com/)

## Installation

1. Clone the top-level `agilescope` repo to your local machine
2. Navigate to the `/server` directory
3. Run `nvm use` to use this project's version of node, then install dependencies using `npm install`
4. Create `.env` file with the following environment variables:

```
  PORT=7777
  AGILESCOPE_CLIENT_URL=http://localhost:8000

  MONGODB_CONNECTION_STRING=<YOUR_MONGODB_CONNECTION_STRING>
  JWT_SECRET_KEY=<SECRET_KEY_STRING>
  BCRYPT_SALT_ROUNDS=<ANY_INTEGER_VALUE>

  SMTP_HOST=<YOUR_SMTP_HOST>
  SMTP_PORT=<YOUR_SMTP_PORT>
  SMTP_USERNAME=<YOUR_SMTP_USERNAME>
  SMTP_PASSWORD=<YOUR_SMTP_PASSWORD>
```

5. Start the server using `npm run dev`
