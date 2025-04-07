import { isTranslationTaskNeeded } from "./check-utils.mjs";

if (isTranslationTaskNeeded()) {
  console.error('echo "please run yarn i18n:translate"');
  process.exit(1);
} else {
  process.exit(0);
}