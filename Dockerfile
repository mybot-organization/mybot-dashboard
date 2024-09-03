# syntax=docker/dockerfile-upstream:master-labs

FROM python:3.12.0-alpine as build
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
# RUN python -m venv /opt/venv
# ENV PATH="/opt/venv/bin:$PATH"
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    : \
    && uv sync --no-dev --frozen \
    && :

FROM python:3.12.0-alpine as base
# https://docs.docker.com/reference/dockerfile/#copy---parents
COPY --parents --from=build /app/.venv /
WORKDIR /app
COPY ./src ./
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=0
CMD ["/bin/sh", "-c", "uvicorn main:app --host 0.0.0.0 --reload"]
