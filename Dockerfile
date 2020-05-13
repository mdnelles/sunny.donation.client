# base image
FROM node:13

# set working directory
WORKDIR /app
#RUN mkdir -p /srv/app/client
#WORKDIR /srv/app/client


# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

# start app
CMD ["npm", "start"]