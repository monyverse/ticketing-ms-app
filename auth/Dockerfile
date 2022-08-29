# pull node image
FROM node:alpine as pnpm-setup

# set container's working directory
WORKDIR /app

RUN npm install -g npm && npm install -g pnpm

FROM pnpm-setup

# copy package.json pnpm lock npmrc to working directory
COPY package.json pnpm-lock.yaml .npmrc ./

# install only prod dependencies
RUN pnpm install --prod

# copy dev files to container working directory
COPY . .

# run
CMD [ "pnpm", "start" ]
