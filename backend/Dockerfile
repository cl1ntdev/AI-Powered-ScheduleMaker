# weeklyscheduler\backend\Dockerfile
# Production-ready multi-stage Dockerfile for FastAPI backend (uses Gunicorn + Uvicorn workers)
#
# Notes for maintainers:
# - The backend package (Python files) is expected to be copied into the image at /app.
# - At runtime the service binds to 0.0.0.0:8000 (exposed below).
# - Provide secrets (e.g. GROQ_API_KEY) through environment or docker-compose.
# - This file tries to detect dependency files:
#    - If you use Poetry -> include pyproject.toml (and optionally poetry.lock)
#    - If you use requirements.txt -> include requirements.txt
#   If neither are present the build will still succeed but you must ensure dependencies
#   are installed another way (or modify this Dockerfile).
#
# Example run (local):
#  docker build -t weeklyscheduler-backend:latest -f backend/Dockerfile .
#  docker run -e GROQ_API_KEY=... -p 8000:8000 weeklyscheduler-backend:latest

# Base image for building dependencies and compiling any wheels
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install build-time packages (kept minimal). Add additional packages here if you need them.
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential curl ca-certificates gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the entire backend so conditional install logic can check for pyproject/requirements and so that
# compiled wheels/source distributions can be produced within the builder stage.
COPY . /app

# Upgrade pip and install runtime server packages (gunicorn + uvicorn) as a safety net.
# Then install project dependencies conditionally:
#  - If pyproject.toml exists -> install Poetry then use it to install dependencies (no-dev)
#  - Else if requirements.txt exists -> pip install -r requirements.txt
# This avoids failing the build in repositories that use different dependency managers.
RUN python -m pip install --upgrade pip setuptools wheel \
 && python -m pip install --no-cache-dir "uvicorn[standard]>=0.20.0" "gunicorn>=20.0.4" \
 && if [ -f pyproject.toml ]; then \
        python -m pip install --no-cache-dir "poetry>=1.4.0"; \
        poetry config virtualenvs.create false --local; \
        poetry install --no-interaction --no-ansi --no-dev; \
    elif [ -f requirements.txt ]; then \
        pip install --no-cache-dir -r requirements.txt; \
    else \
        echo "No pyproject.toml or requirements.txt found. Make sure dependencies are installed another way."; \
    fi

# Final smaller runtime image
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \    
    # Default port for the app
    PORT=8000

# Create non-root user for safer runtime
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

# Copy installed python packages and the application code from the builder stage.
# Copying site-packages is a pragmatic way to avoid re-installing all deps in the final image.
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

# Ensure correct ownership
RUN chown -R app:app /app

USER app

EXPOSE 8000

# Recommended Gunicorn + Uvicorn worker command for production
# - Uses Uvicorn worker class for ASGI
# - GUNICORN_WORKERS can be overridden at docker run / compose time
# - Increase --timeout if you expect long-running requests
ENV GUNICORN_WORKERS=2
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "-b", "0.0.0.0:8000", "--workers", "2", "--timeout", "120", "--log-level", "info"]
