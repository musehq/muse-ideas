#!/usr/bin/env bash

NAME=$1

handle_error () { echo -e "\n🛑 ERRORED"; exit; }

STAGED_FOLDER="staging/${NAME}"

NUM_GLB=`find ${STAGED_FOLDER} -name "*.glb" 2>/dev/null | wc -l`

echo -e "👉 Found\t $NUM_GLB glb"

# check for 3d file
if [ $NUM_GLTF == 0 ] && [ $NUM_GLB == 0 ]
then
    echo -e "🛑 Couldn't find glb or gltf, exiting..."
    exit
fi

DATE_S=`date +%s`

# loop over every glb in the directory and subdirectories
find "${STAGED_FOLDER}" -name '*.glb' | while read line; do
    echo -e "👉 Processing $line"

    # find first file with given extension
    STAGED_FILE="$line"
    FILE_NAME=`basename ${STAGED_FILE} .glb`
    CLOUD_FOLDER="${NAME}-${DATE_S}"
    CLOUD_URL="https://d27rt3a60hh1lx.cloudfront.net/models/${CLOUD_FOLDER}/${FILE_NAME}.glb.gz"

    #gzip
    gzip -c "${STAGED_FILE}" > "${STAGED_FILE}.gz"
    echo -e "\t\t\t👉 Gzip\t\t\tComplete"

    # upload to s3
    aws s3 cp "${STAGED_FILE}" "s3://spaces-gallery-assets/models/${CLOUD_FOLDER}/${FILE_NAME}.glb" >/dev/null || handle_error
    aws s3 cp "${STAGED_FILE}.gz" "s3://spaces-gallery-assets/models/${CLOUD_FOLDER}/${FILE_NAME}.glb.gz" --content-encoding "gzip" >/dev/null || handle_error
    echo -e "\t\t\t👉 Upload\t\tComplete, file available at the url below\n${CLOUD_URL}"
done


# clean folder
rm ${STAGED_FOLDER}/*.gz
echo -e "👉 Clean\t\tComplete"

echo -e "\nDone 🤛👁👄👁🤜"