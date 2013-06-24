#!/bin/bash
# This script was taken from https://github.com/zfdang/memcached-in-openshift
# This is a simple build script and will be executed on your CI system if 
# available.  Otherwise it will execute while your application is stopped
# before the deploy step.  This script gets executed directly, so it
# could be python, php, ruby, etc.
#!/bin/bash
# This is a simple build script and will be executed on your CI system if 
# available.  Otherwise it will execute while your application is stopped
# before the deploy step.  This script gets executed directly, so it
# could be python, php, ruby, etc.

# download exiv2, and install it into OPENSHIFT_DATA_DIR/exiv2
MEMCACHED_VERSION=1.4.15
MEMCACHED_BINARY=${OPENSHIFT_DATA_DIR}memcached/bin/memcached

if [ ! -d ${OPENSHIFT_DATA_DIR}memcached ]; then
  echo "create ${OPENSHIFT_DATA_DIR}memcached..."
  mkdir ${OPENSHIFT_DATA_DIR}memcached

  echo "download memcached to temp folder..."
  cd ${OPENSHIFT_TMP_DIR}
  if [ ! -d memcached-${MEMCACHED_VERSION} ]; then
    curl -L -o memcached-${MEMCACHED_VERSION}.tar.gz http://memcached.googlecode.com/files/memcached-${MEMCACHED_VERSION}.tar.gz
    tar -xvzf memcached-${MEMCACHED_VERSION}.tar.gz
  fi

  echo "Start compiling memcached ${MEMCACHED_VERSION} on Openshift (i'll take a while)"
  cd memcached-${MEMCACHED_VERSION}
  sh configure --prefix=${OPENSHIFT_DATA_DIR}memcached
  make
  make install 

  if [ -e "${MEMCACHED_BINARY}" ]; then
     echo "memcached was installed successfully: ${MEMCACHED_BINARY}"
  else
     echo "-------------------------------------------"
     echo "Failed to install memcached!"
     echo "Please install memcached into ${MEMCACHED_BINARY} manually!"
     echo "-------------------------------------------"
  fi
else
  echo "${OPENSHIFT_DATA_DIR}memcached exists already."
fi
