/**
 * Absolute URL for a file under the repo root (e.g. assets/models/foo.obj).
 * fetch() resolves relative strings against the page URL, which breaks for
 * ../../ paths when the game is not served from the site root; this uses
 * the module location under /src/ instead.
 */
export function assetUrl( pathFromRepoRoot ) {
  return new URL( `../${ pathFromRepoRoot }`, import.meta.url ).href;
}
