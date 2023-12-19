FROM node:21

RUN npm install -g solc

RUN echo "cd /app/frontend && npm i" >> /run.sh
RUN echo "cd /app/ && npm i" >> /run.sh
RUN echo "cd /app/frontend && npm start >~/frontend.log 2>&1 &" >> /run.sh
RUN echo "cd /app && npx hardhat node  >~/hardhat.log 2>&1" >> /run.sh
RUN chmod 770 /run.sh


CMD ["/run.sh"]
