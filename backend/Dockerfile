# Use an official lightweight Python Alpine image
FROM python:3.12-alpine

# Set environment variables to prevent Python from writing .pyc files and to enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for MySQL
RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    mariadb-connector-c-dev \
    libffi-dev \
    && rm -rf /var/cache/apk/*

# Create a virtual environment
RUN python -m venv /opt/venv

# Activate the virtual environment and ensure it's in the PATH
ENV PATH="/opt/venv/bin:$PATH"

# Copy the requirements file to the container
COPY requirements.txt /app/requirements.txt

# Install Python dependencies using the virtual environment
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

# Copy the entire application source code to the container
COPY . /app

# Expose port 8000 for the Django development server
EXPOSE 8000

# Default command to run the application
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]