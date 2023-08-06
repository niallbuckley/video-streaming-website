FROM node:18

WORKDIR /app

COPY package*.json .

RUN apt-get update && apt-get install -y ffmpeg

RUN npm install

COPY . .

# Make port 3000 available outside of the conainter
EXPOSE 3000

# CMD is run when it's only once and RUN is run in the other conditions 
# only one CMD allowed
CMD ["npm","start"]