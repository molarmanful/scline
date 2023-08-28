FROM molarmanful/sclin as pre

RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH $PATH:/root/.volta/bin
RUN volta install node

RUN mkdir /app
WORKDIR /app

COPY . .
RUN npm i -g pnpm && pnpm i && pnpm build


FROM ubuntu

COPY --from=pre /opt/java/openjdk /opt/java/openjdk
COPY --from=pre /scbin /scbin
COPY --from=pre /root/.volta /root/.volta
COPY --from=pre /app /app

WORKDIR /app
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV PATH $PATH:/opt/java/openjdk/bin:/scbin:/root/.volta/bin
ENV NODE_ENV production
ENV BODY_SIZE_LIMIT 128000
CMD ["pnpm", "start"]