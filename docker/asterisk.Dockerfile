FROM andrius/asterisk:latest

COPY ./asterisk-config/ /etc/asterisk/


EXPOSE 5060/udp 5060/tcp 5038/tcp 10000-10100/udp

CMD ["/usr/sbin/asterisk", "-f"]
