FROM eclipse-temurin:20-jre as pre
RUN wget https://github.com/molarmanful/sclin/releases/latest/download/sclin

FROM pre
RUN mkdir bin
ENV PATH="$PATH:bin"
COPY sclin bin