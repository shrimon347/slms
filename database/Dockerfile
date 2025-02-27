# Use the official MySQL image (Alpine-based for a smaller footprint)
FROM mysql:8.0

# Copy the initialization SQL script to automatically run at container startup
COPY init.sql /docker-entrypoint-initdb.d/1-init.sql

# Expose MySQL port
EXPOSE 3306