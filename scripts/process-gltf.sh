#!/usr/bin/env bash

NAME=$1

handle_error () { echo -e "\n🛑 ERRORED"; exit; }

STAGED_FOLDER="./staging/${NAME}"

NUM_GLTF=`ls -1 ${STAGED_FOLDER}/*.gltf 2>/dev/null | wc -l`
NUM_GLB=`ls -1 ${STAGED_FOLDER}/*.glb 2>/dev/null | wc -l`

echo -e "👉 Found\t $NUM_GLTF gltf, $NUM_GLB glb"

# check for 3d file
if [ $NUM_GLTF == 0 ] && [ $NUM_GLB == 0 ]
then
    echo -e "🛑 Couldn't find glb or gltf, exiting..."
    exit
fi

# get correct file extension (glb vs gltf)
EXTENSION="glb"
if [ $NUM_GLTF != 0 ]
then
    EXTENSION="gltf"
fi

# find first file with given extension
FILES=`find ${STAGED_FOLDER}/ -name *.${EXTENSION} -type f -print -quit`
FILE_NAME=`basename ${FILES} .${EXTENSION}`

# file outputs
DATE_S=`date +%s`
STAGED_FILE="${STAGED_FOLDER}/${FILE_NAME}.${EXTENSION}"
OUTPUT_FILE="${STAGED_FOLDER}/${STAGED_FOLDER}.glb"
JSX_FILE="/src/models/${FILE_NAME}.tsx"
CLOUD_FOLDER="${NAME}-${DATE_S}"
CLOUD_URL="https://d27rt3a60hh1lx.cloudfront.net/models/${CLOUD_FOLDER}/${FILE_NAME}.glb.gz"

# convert gltf to glb
if [ $EXTENSION == "gltf" ]
then
    echo -e "👉 Convert\t\tGLTF to GLB"
    NEW_OUTPUT="${STAGED_FOLDER}/${FILE_NAME}.glb"
    gltf-pipeline -i ${STAGED_FILE} -o ${NEW_OUTPUT} || handle_error
    STAGED_FILE=$NEW_OUTPUT
fi

echo -e "👉 Found\t\t${STAGED_FILE}"

# draco compression, if it fails assume it's already compressed and rename to output file
#gltf-pipeline -i "${STAGED_FILE}" -o "${OUTPUT_FILE}" -d
#echo -e "👉 Draco\t\tComplete"

# gltfjsx
npx @react-three/gltfjsx "${STAGED_FILE}" "${JSX_FILE}" -d -t -v -p 4 || handle_error
echo -e "👉 Gltfjsx\t\tComplete"

#gzip
gzip -c "${STAGED_FILE}" > "${STAGED_FILE}.gz"
echo -e "👉 Gzip\t\t\tComplete"

# upload to s3
aws s3 cp "${STAGED_FILE}" "s3://spaces-gallery-assets/models/${CLOUD_FOLDER}/${FILE_NAME}.glb"|| handle_error
aws s3 cp "${STAGED_FILE}.gz" "s3://spaces-gallery-assets/models/${CLOUD_FOLDER}/${FILE_NAME}.glb.gz" --content-encoding "gzip" || handle_error
echo -e "👉 Upload\t\tComplete, file available at the url below\n${CLOUD_URL}"

# clean folder
if [ $EXTENSION == "gltf" ]
then
    rm ${STAGED_FOLDER}/*.glb
fi
rm ${STAGED_FOLDER}/*.gz
echo -e "👉 Clean\t\tComplete"

echo -e "\nDone 🤛👁👄👁🤜"