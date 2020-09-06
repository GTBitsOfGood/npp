# npp

## Stack
* React.js: Front-end
* Next.js: API routes and server-side rendering
* MongoDB: Permanently storing data
* Next-Auth and Auth0: Single Sign On (SSO) setup
* eslint: Automatically identifying and fixing code errors
* prettier: Setting a common code style and fixing any issues

## Setup

### MongoDB

A running instance of MongoDB is required this project.
- Decide if you want to run MongoDB locally or remotely
- Locally
  1. [Download MongoDB Community Server](https://www.mongodb.com/download-center/community)
  2. Go through the installation instructions.
     - Leave the port at default 27017
- Remotely
  1. Create a MongoDB instance on MongoDB Atlas
  2. In Security → Network Access: add the IP address `0.0.0.0/0` (all IPs)
  3. In Security → Database Access: Add new database user
  4. In Data Storage → Clusters: Find your cluster and click `Connect` →
  `Connect your application` and copy the connection string, set the username and password,
  and set this as `DATABASE_URL` in `.env.local`
- It's very helpful to install MongoDB Compass to see your database contents

### Auth0
1. Create a `Regular Web Application` in Auth0.
2. In the app settings, add `http://localhost:3000/api/auth/callback/auth0`
  (and also the prod callback replacing http:///localhost:3000) to `Allowed Callback URLs`

### Node
1. Clone this project to your computer
2. Navigate to this project in terminal and enter `npm install`
3. Run `npm run secrets` to sync secrets to `.env.local`
  - **OR** Rename `.env.local.example` to `.env.local` and fill it out with the dev config
  - **NOTE**: Windows users will need to run `npm run secrets:login` and `npm run secrets:sync` instead of the above command

### Updating Env Vars
- For dev, update `.env.local`
- For production, add the env vars to your host, **NEVER** commit `.env` to your VCS

## Running

### Development
To understand this code better, read the [Code Tour](/CODETOUR.md).
1. Run `npm install`
2. Run `npm run dev`

### Production
1. Setup your host/vm and the necessary env vars
2. Run `npm install`
3. Run `npm run start`
