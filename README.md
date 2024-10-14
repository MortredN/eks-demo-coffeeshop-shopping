## EKS Demo Coffee Shop - Shopping

This backend application is a part (or microservice) of an [AWS EKS demo deployment project](https://github.com/MortredN/eks-demo-coffeeshop), handling products and orders. This app uses Express.js to run.

### Development environment setup

Clone repository and install dependencies:

```bash
git clone https://github.com/MortredN/eks-demo-coffeeshop-shopping.git
cd eks-demo-coffeeshop-shopping

npm install
```

Add an environment file `.env` for the development environment (Check the `.env.example` file): *Make sure the access & refresh secret on both this and [the other backend](https://github.com/MortredN/eks-demo-coffeeshop-customer) is the same*

```properties
# Use either these
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
DB_HOST=<your-db-host>
DB_PORT=5432
DB_DBNAME=<your-db-name-shopping>
# or this
DB_URL=postgresql://<your-db-username>:<your-db-password>@<your-db-host>/<your-db-name-shopping>

JWT_ACCESS_SECRET=<random_secret_1>
JWT_REFRESH_SECRET=<random_secret_2>
API_CUSTOMER_URL=http://localhost:4001
```

This app uses [Drizzle ORM](https://orm.drizzle.team/docs/overview) to define and manage PostgreSQL database schemas, access data in a familiar SQL-like way. Generate and run the SQL migration files, then start the app on development:

```bash
npm run generate && npm run migrate

npm run dev
```

### Use Docker

[<img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff">](https://hub.docker.com/r/mortredn/eks-demo-coffeeshop-shopping)

You can also run this app as a Docker container. Either pull from the above public repository or build your own:

```bash
# Pull image
docker pull mortredn/eks-demo-coffeeshop-shopping:latest
docker tag mortredn/eks-demo-coffeeshop-shopping:latest eks-demo-coffeeshop-shopping:latest

# Build from local
docker build -t eks-demo-coffeeshop-shopping:latest .

# Run the container
docker run --name eks-demo-coffeeshop-shopping
-p 4002:4000 \
-e DB_USERNAME=username \
-e DB_PASSWORD=password \
-e DB_HOST=host.docker.internal \
-e DB_PORT=5432 \
-e DB_DBNAME=database_shopping \
-e JWT_ACCESS_SECRET=random_secret_1 \
-e JWT_REFRESH_SECRET=random_secret_2 \
-e API_CUSTOMER_URL=http://host.docker.internal:4001 \
-d eks-demo-coffeeshop-shopping:latest

# Or run using DB_URL env

docker run --name eks-demo-coffeeshop-shopping
-p 4002:4000 \
-e DB_URL=postgresql://username:password@host.docker.internal:5432/database_shopping \
-e JWT_ACCESS_SECRET=random_secret_1 \
-e JWT_REFRESH_SECRET=random_secret_2 \
-e API_CUSTOMER_URL=http://host.docker.internal:4001 \
-d eks-demo-coffeeshop-shopping:latest
```
