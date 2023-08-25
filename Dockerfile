FROM eclipse-temurin:20-jre as pre

RUN mkdir /scbin && wget https://github.com/molarmanful/sclin/releases/latest/download/sclin -P /scbin && chmod +x /scbin/sclin

RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH $PATH:/root/.volta/bin
RUN volta install node

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm i -g pnpm && pnpm i && pnpm build


FROM ubuntu:latest

COPY --from=pre /opt/java/openjdk /opt/java/openjdk
COPY --from=pre /scbin /scbin
COPY --from=pre /root/.volta /root/.volta
COPY --from=pre /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH $PATH:/opt/java/openjdk/bin:/scbin:/root/.volta/bin
CMD ["pnpm", "start"]