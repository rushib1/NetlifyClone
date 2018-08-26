from ubuntu:14.04

MAINTAINER RushiBhargav

ENV LANGUAGE en_US:en
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV PANDOC_VERSION 2.2.1

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y update

RUN apt-get install -y --no-install-recommends software-properties-common language-pack-en-base apt-transport-https

RUN add-apt-repository -y ppa:git-core/ppa && \
    apt-get install -y --no-install-recommends \
        git \
        ssh \
        g++ \
        wget



# language export needed for ondrej/php PPA https://github.com/oerdnj/deb.sury.org/issues/56
# RUN export DEBIAN_FRONTEND=noninteractive && \
#     apt-get -y update && \
#     apt-get install -y --no-install-recommends software-properties-common language-pack-en-base apt-transport-https gnupg-curl && \
#     echo 'Acquire::Languages {"none";};' > /etc/apt/apt.conf.d/60language && \
#     echo 'LANG="en_US.UTF-8"' > /etc/default/locale && \
#     echo 'LANGUAGE="en_US:en"' >> /etc/default/locale && \
#     locale-gen en_US.UTF-8 && \
#     update-locale en_US.UTF-8 && \
    # apt-key adv --fetch-keys https://packagecloud.io/github/git-lfs/gpgkey && \
    # apt-add-repository -y -s 'deb https://packagecloud.io/github/git-lfs/ubuntu/ trusty main' && \
#     add-apt-repository -y ppa:ondrej/php && \
#     add-apt-repository -y ppa:openjdk-r/ppa && \
#     add-apt-repository -y ppa:git-core/ppa && \
#     add-apt-repository -y ppa:rwky/graphicsmagick && \
#     add-apt-repository -y ppa:deadsnakes/ppa && \
#     add-apt-repository -y ppa:kelleyk/emacs && \
#     apt-get -y update && \
#     apt-get install -y --no-install-recommends \
#         advancecomp \
#         apache2-utils \
#         autoconf \
#         automake \
#         bison \
#         build-essential \
#         bzr \
#         cmake \
#         curl \
#         emacs25-nox \
#         expect \
#         fontconfig \
#         fontconfig-config \
#         g++ \
#         gawk \
#         git \
#         git-lfs \
#         gifsicle \
#         gobject-introspection \
#         graphicsmagick \
#         graphviz \
#         gtk-doc-tools \
#         imagemagick \
#         jpegoptim \
#         jq \
#         language-pack-ar \
#         language-pack-ca \
#         language-pack-cs \
#         language-pack-da \
#         language-pack-de \
#         language-pack-el \
#         language-pack-es \
#         language-pack-eu \
#         language-pack-fi \
#         language-pack-fil \
#         language-pack-fr \
#         language-pack-gl \
#         language-pack-he \
#         language-pack-hi \
#         language-pack-it \
#         language-pack-ja \
#         language-pack-ka \
#         language-pack-ko \
#         language-pack-nan \
#         language-pack-nn \
#         language-pack-pl \
#         language-pack-pt \
#         language-pack-ro \
#         language-pack-ru \
#         language-pack-sa \
#         language-pack-sv \
#         language-pack-ta \
#         language-pack-th \
#         language-pack-tr \
#         language-pack-uk \
#         language-pack-vi \
#         language-pack-yi \
#         language-pack-zh-hans \
#         language-pack-zh-hant \
#         libasound2 \
#         libcurl3 \
#         libcurl3-gnutls \
#         libcurl3-openssl-dev \
#         libexif-dev \
#         libffi-dev \
#         libfontconfig1 \
#         libgconf-2-4 \
#         libgd-dev \
#         libgdbm-dev \
#         libgif-dev \
#         libglib2.0-dev \
#         libgmp3-dev \
#         libgraphicsmagick3 \
#         libgtk-3-0 \
#         libgtk2.0-0 \
#         libicu-dev \
#         libimage-exiftool-perl \
#         libjpeg-progs \
#         libjpeg-turbo8-dev \
#         libmagickwand-dev \
#         libmcrypt-dev \
#         libncurses5-dev \
#         libnss3 \
#         libpng12-dev \
#         libreadline6-dev \
#         libsm6 \
#         libsqlite3-dev \
#         libssl-dev \
#         libtiff5-dev \
#         libwebp-dev \
#         libwebp5 \
#         libxml2-dev \
#         libxrender1 \
#         libxslt-dev \
#         libxss1 \
#         libxtst6 \
#         libyaml-dev \
#         mercurial \
#         nasm \
#         openjdk-8-jdk \
#         optipng \
#         php5.6 \
#         php5.6-xml \
#         php5.6-mbstring \
#         php5.6-gd \
#         php5.6-sqlite3 \
#         php7.2 \
#         php7.2-xml \
#         php7.2-mbstring \
#         php7.2-gd \
#         php7.2-sqlite3 \
#         pngcrush \
#         python-setuptools \
#         python2.7-dev \
#         python3 \
#         python3-dev \
#         python3.5 \
#         python3.5-dev \
#         python3.6 \
#         python3.6-dev \
#         rsync \
#         software-properties-common \
#         sqlite3 \
#         ssh \
#         strace \
#         swig \
#         unzip \
#         wget \
#         xvfb \
#         zip \
#         && \
#     /var/lib/dpkg/info/ca-certificates-java.postinst configure && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
#     apt-get autoremove -y && \
#     unset DEBIAN_FRONTEND
    
USER root

ENV PATH /usr/local/rvm/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin


RUN adduser --system rouge --home /opt/buildhome

USER rouge

RUN git clone https://github.com/creationix/nvm.git ~/.nvm && \
    cd ~/.nvm && \
    git checkout v0.33.4 && \
    cd /

RUN mkdir -p /opt/buildhome




