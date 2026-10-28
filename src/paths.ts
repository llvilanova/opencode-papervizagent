import { resolve } from "node:path";

/** Package root, whether this module runs from src/ or from a dist/ bundle. */
export const PACKAGE_ROOT = resolve(import.meta.dir, "..");
