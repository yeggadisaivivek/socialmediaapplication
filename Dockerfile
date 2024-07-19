FROM ubuntu
RUN apt-get update
RUN apt-get install figlet
COPY syeggadi_q4.sh /
RUN chmod +x /syeggadi_q4.sh
CMD /syeggadi_q4.sh