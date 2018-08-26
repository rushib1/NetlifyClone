: ${NETLIFY_BUILD_BASE="/opt/buildhome"}
NETLIFY_CACHE_DIR="$NETLIFY_BUILD_BASE/cache"
NETLIFY_REPO_DIR="$NETLIFY_BUILD_BASE/repo"

mkdir -p $NETLIFY_CACHE_DIR/node_version
mkdir -p $NETLIFY_CACHE_DIR/node_modules

export NVM_DIR="$HOME/.nvm"

run_npm() {
    if install_deps package.json $NETLIFY_CACHE_DIR/package-sha
    then
        npm install --save
    fi

    echo "$(shasum package.json)" > $NETLIFY_CACHE_DIR/package-sha
    export PATH=$(npm bin):$PATH
}

install_deps() {
  [ -f $1 ] || return 0
  [ -f $2 ] || return 0

  SHA1="$(shasum $1)"
  SHA2="$(cat $2)"
  if [ "$SHA1" == "$SHA2" ]
  then
    return 1
  else
    return 0
  fi
}

install_dependencies() {
    local defaultNodeVersion=$1

    source $NVM_DIR/nvm.sh
    : ${NODE_VERSION="$defaultNodeVersion"}

    if [ $(ls $NETLIFY_CACHE_DIR/node_version/) ]
    then
        echo "Started restoring cached node version"
        rm -rf $NVM_DIR/versions/node/*
        mkdir -p $NVM_DIR/versions/node/
        cp -p -r $NETLIFY_CACHE_DIR/node_version/* $NVM_DIR/versions/node/
        echo "Finished restoring cached node version"
    fi

    if nvm install $NODE_VERSION
    then
        NODE_VERSION=$(nvm current)
        export NODE_VERSION=$NODE_VERSION

        if [ "$NODE_VERSION" == "none" ]
        then
            nvm debug
            env
        fi
    fi

    if [ -f package.json ]
    then
        restore_cwd_cache node_modules "node modules"
        run_npm
    fi
}

cache_artifacts() {
    cache_cwd_directory "node_modules" "node modules"

    if ! [ -d $NETLIFY_CACHE_DIR/node_version/$NODE_VERSION ]
    then
        rm -rf $NETLIFY_CACHE_DIR/node_version
        mkdir $NETLIFY_CACHE_DIR/node_version
        mv $NVM_DIR/versions/node/$NODE_VERSION $NETLIFY_CACHE_DIR/node_version/
        echo "Cached node version $NODE_VERSION"
    fi
}

move_cache() {
  local src=$1
  local dst=$2
  if [ -d $src ]
  then
    echo "Started $3"
    rm -rf $dst
    mv $src $dst
    echo "Finished $3"
  fi
}

restore_home_cache() {
  move_cache "$NETLIFY_CACHE_DIR/$1" "$HOME/$1" "restoring cached $2"
}

cache_home_directory() {
  move_cache "$HOME/$1" "$NETLIFY_CACHE_DIR/$1" "saving $2"
}

restore_cwd_cache() {
  move_cache "$NETLIFY_CACHE_DIR/$1" "$PWD/$1" "restoring cached $2"
}

cache_cwd_directory() {
  move_cache "$PWD/$1" "$NETLIFY_CACHE_DIR/$1" "saving $2"
}