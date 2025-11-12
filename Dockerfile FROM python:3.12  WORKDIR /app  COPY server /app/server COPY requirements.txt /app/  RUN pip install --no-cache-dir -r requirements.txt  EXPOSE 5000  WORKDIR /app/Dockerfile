FROM python:3.12

WORKDIR /app

COPY server /app/server
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

WORKDIR /app/server
CMD ["python", "app.py"]
