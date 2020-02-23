ARG ALPINE_VERSION=3.9

FROM elixir:1.9.0-alpine as builder

RUN mkdir /app
WORKDIR /app

COPY . .

RUN mix local.hex --force && \
  mix local.rebar --force && \
  mix deps.get && \
  mix deps.compile

RUN mix compile
RUN MIX_ENV=prod mix release

FROM alpine:${ALPINE_VERSION} AS app
RUN apk add --update bash openssl

RUN mkdir /app
WORKDIR /app

COPY --from=builder /app/_build/prod/rel/definitely_not_dobble ./
RUN chown -R nobody: /app
USER nobody

ENV HOME=/app

CMD ./bin/definitely_not_dobble start
