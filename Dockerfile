FROM node:16.17.1
RUN npm install -g http-server
RUN npm install -g serve
WORKDIR /app
ENV REACT_APP_API_URL=http://127.0.0.1:8000/
ENV BASE_URL=http://127.0.0.1:8000/
COPY package*.json ./
RUN npm --legacy-peer-deps install
EXPOSE 3000
CMD [ "serve", "-s","build" ]
