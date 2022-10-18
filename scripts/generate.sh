NAME=$1

TYPE="chaos"

PAGE_TEMPLATE="scripts/TEMPLATE_PAGE.txt"
IDEA_TEMPLATE="scripts/TEMPLATE_IDEA.txt"
INDEX_TEMPLATE="scripts/TEMPLATE_INDEX.txt"



PAGE_FILE="src/pages/${TYPE}/${NAME}/index.tsx"
mkdir -p `dirname ${PAGE_FILE}` && touch ${PAGE_FILE}

IDEA_FILE="src/ideas/${TYPE}/${NAME}/idea.json"
mkdir -p `dirname ${IDEA_FILE}` && touch ${IDEA_FILE}

INDEX_FILE="src/ideas/${TYPE}/${NAME}/index.tsx"
mkdir -p `dirname ${INDEX_FILE}` && touch ${INDEX_FILE}


PATHED_NAME="${TYPE}/${NAME}"
PAGE_TEXT=$( cat "${PAGE_TEMPLATE}" )
SEARCH_STRING="TEMPLATE_PAGE"
PAGE_CONTENT="${PAGE_TEXT//${SEARCH_STRING}/${PATHED_NAME}}"
> "${PAGE_FILE}"
echo "${PAGE_CONTENT}" >> ${PAGE_FILE}
prettier --write ${PAGE_FILE}

IDEA_TEXT=$( cat "${IDEA_TEMPLATE}" )
SEARCH_STRING="IDEA_NAME"
IDEA_CONTENT="${IDEA_TEXT//${SEARCH_STRING}/${NAME}}"
> "${IDEA_FILE}"
echo "${IDEA_CONTENT}" >> ${IDEA_FILE}
prettier --write ${IDEA_FILE}

INDEX_TEXT="$( cat "${INDEX_TEMPLATE}" )"
SEARCH_STRING="IDEA_NAME"
INDEX_CONTENT="${INDEX_TEXT//${SEARCH_STRING}/${NAME}}"
> "${INDEX_FILE}"
echo "${INDEX_CONTENT}" >> ${INDEX_FILE}
prettier --write ${INDEX_FILE}