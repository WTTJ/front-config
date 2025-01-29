export $(cat i18n-env | xargs)

# res returns the number of different staged files that might include translations
res=$(git --no-pager diff --staged --name-only "$EXTRACT_FROM_PATTERN" | wc -l)

# if res is > 0 means if staged files might include translations
if [ $res -gt 0 ]; then
  # extract translations from staged files if any and create
  # object of new translations in a temp.json file
  if [ -n "${PATH_TO_IGNORE}" ]; then
    #extract command with exclusion if env var PATH_TO_IGNORE is set
    yarn run formatjs extract $(git --no-pager diff --staged --name-only "$EXTRACT_FROM_PATTERN" ":(exclude)$PATH_TO_IGNORE" ':(exclude)**/*.d.ts' | xargs echo -n | xargs -0) --out-file $LOCALES_DIR_PATH/temp.json --flatten --extract-source-location
  else
    #extract command without exclusion if env var PATH_TO_IGNORE is not set
    yarn run formatjs extract $(git --no-pager diff --staged --name-only "$EXTRACT_FROM_PATTERN" ':(exclude)**/*.d.ts' | xargs echo -n | xargs -0) --out-file $LOCALES_DIR_PATH/temp.json --flatten --extract-source-location
  fi

  if node node_modules/wttj-config/lib/i18n/check.mjs; then
    rm -f $LOCALES_DIR_PATH/temp.json

    # no need to translate anything either because temp file object is empty
    # or because the translations it contains already exist in source locale
    exit 0
  else
    # translation script needs to be launched because temp file translations are new
    echo "🛠  Translate and exit with error"
    echo "============================================="
    yarn i18n:translate

    # we exit with error so that commit hook aborts because new translations need to be checked
    # and added to the commit
    exit 1
  fi

else
  # exit early with no error because there is nothing to translate
  exit 0
fi

