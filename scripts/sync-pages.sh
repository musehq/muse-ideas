#!/usr/bin/env bash

IDEAS_FOLDER="src/ideas"
PAGES_FOLDER="src/pages"
TEMPLATE_FILE="scripts/TEMPLATE_PAGE.txt"

rm -rf "${PAGES_FOLDER}"/*

find "${IDEAS_FOLDER}" -name 'idea.json' | while read line; do
  if [[ $line != *'.idea'* ]]; then
    echo -e "👉 Processing $line"
    # at this point looks like src/ideas/universe/Ascension/idea.json

    # remove first part
    SEARCH_STRING="src/ideas/"
    NEW_FOLDER="${line/${SEARCH_STRING}/}"

    # remove last part
    SEARCH_STRING="/idea.json"
    NEW_FOLDER="${NEW_FOLDER/${SEARCH_STRING}/}"

    NEW_FILE="${PAGES_FOLDER}/${NEW_FOLDER}.tsx"

    # get content ready
    TEMPLATE_PAGE=$( cat ${TEMPLATE_FILE} )
    SEARCH_STRING="TEMPLATE_PAGE"
    CONTENT="${TEMPLATE_PAGE/${SEARCH_STRING}/${NEW_FOLDER}}"

    mkdir -p `dirname ${NEW_FILE}` && touch "${NEW_FILE}"

    # clear the file
    > "${NEW_FILE}"

    # write new content
    echo ${CONTENT} >> ${NEW_FILE}
  fi
done

prettier --write 'src/pages/**/*.tsx'


