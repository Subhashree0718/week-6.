FROM public.ecr.aws/lambda/nodejs:20
RUN dnf install -y python3 python3-pip
# RUN apt-get update && \
#     apt-get install -y python3.10 python3.10-venv

RUN python3 -v
RUN python3 -m pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --upgrade pip --no-cache-dir


WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
