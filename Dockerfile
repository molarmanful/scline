FROM molarmanful/sclin:latest AS sclin

RUN apt-get update && \
    apt-get install -y --no-install-recommends acl && \
    rm -rf /var/lib/apt/lists/*


FROM node:22 AS node

WORKDIR /app
EXPOSE 3000
COPY . .

RUN npm i -g pnpm && pnpm i


FROM node AS dev

COPY --from=sclin /usr/bin/setfacl /usr/bin/setfacl
COPY --from=sclin /opt/java/openjdk /opt/java/openjdk
COPY --from=sclin /scbin /scbin
COPY --from=node /app /app

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PATH $PATH:/opt/java/openjdk/bin:/scbin
ENV BODY_SIZE_LIMIT 128000

RUN scripts/precmd.sh
CMD ["pnpm", "dev", "--host=0.0.0.0", "--port=3000"]


FROM node AS node-build

COPY . .
RUN pnpm build


FROM node-build AS prod

COPY --from=sclin /usr/bin/setfacl /usr/bin/setfacl
COPY --from=sclin /opt/java/openjdk /opt/java/openjdk
COPY --from=sclin /scbin /scbin
COPY --from=node-build /app /app

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PATH $PATH:/opt/java/openjdk/bin:/scbin
ENV NODE_ENV production
ENV BODY_SIZE_LIMIT 128000

RUN scripts/precmd.sh
CMD ["pnpm", "start"]
