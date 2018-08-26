: ${NETLIFY_IMAGE="cloner:latest"}
: ${NODE_VERSION="8"}

REPO_URL=$1

mkdir -p tmp

# : ${T=`mktemp -d tmp/tmp.XXXXXXXX`}
T="tmp/$3"
mkdir -p $T

echo "Using temp dir: $T"
chmod +w $T
mkdir -p $T/keys
mkdir -p $T/repo
mkdir -p $T/scripts
mkdir -p $T/cache
chmod a+rwx $T/*

cp run-build/* $T/scripts
chmod +x $T/scripts

echo "Cloning repo $1"
rm -rf $T/repo_shave
echo "$2" > $T/keys/private.pem
chmod 400 $T/keys/private.pem
export GIT_SSH_COMMAND="ssh -o IdentitiesOnly=yes -i $T/keys/private.pem -F /dev/null"
git clone --depth 1 $REPO_URL $T/repo_shave/ &> /dev/null
chmod a+rwx $T/repo_shave/

SCRIPT="/opt/buildhome/scripts/run-build.sh $5"

docker run --rm \
    -v $PWD/$T/scripts:/opt/buildhome/scripts \
    -v $PWD/$T/repo:/opt/buildhome/repo \
    -v $PWD/$T/repo_shave:/opt/buildhome/repo_shave \
    -v $PWD/$T/cache:/opt/buildhome/cache \
    -it \
    $NETLIFY_IMAGE $SCRIPT

mkdir -p "app/sites/$4"
mv $T/repo/$6/* "app/sites/$4"