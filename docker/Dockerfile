# modified ubuntu https://github.com/phusion/baseimage-docker
FROM phusion/baseimage
CMD ["/sbin/my_init"]

RUN apt-get update && apt-get install -y \
    wget \
    xdg-utils \
    zenity \
    ttf-mscorefonts-installer \
    fonts-wqy-zenhei \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2


RUN wget --no-verbose https://download.screamingfrog.co.uk/products/seo-spider/screamingfrogseospider_11.3_all.deb -O /seoscreamingfrog.deb && \
    dpkg -i /seoscreamingfrog.deb && \
    apt-get install -f -y

COPY spider.config /root/.ScreamingFrogSEOSpider/spider.config
COPY data /root/.ScreamingFrogSEOSpider/licence.txt

RUN mkdir /home/crawls && chown www-data:www-data /home/crawls && chmod 666 /home/crawls

ENTRYPOINT ["/usr/bin/screamingfrogseospider"]

CMD ["--help"]