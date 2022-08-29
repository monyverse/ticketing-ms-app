# pull node image
FROM node:alpine

# set container's working directory
WORKDIR /app

# copy package json to working directory
COPY package*.json ./

# install only prod dependencies
RUN npm install --only=prod

# copy dev files to container working directory
COPY . .

# run
CMD [ "npm", "start" ]

