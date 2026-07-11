/**
 * HEIC/HEIF -> JPG converter lato client.
 *
 * Contesto:
 * iPhone da iOS 11+ salva foto in HEIC. Le versioni recenti (iOS 17+) usano HEIC HDR con
 * "gain map" (brand `tmap`) che libheif 1.17 lato server non decodifica. La conversione
 * lato client tramite heic2any usa il decoder nativo del browser (Safari legge HEIC HDR
 * senza problemi), evitando totalmente il problema server-side.
 *
 * Usage:
 *   import { convertHeicIfNeeded } from 'src/utils/heicConverter';
 *   const jpgFile = await convertHeicIfNeeded(originalFile);
 *
 * Se il file NON e' HEIC/HEIF, ritorna il file originale invariato.
 * Se e' HEIC/HEIF, ritorna un nuovo File con estensione .jpg e MIME image/jpeg.
 * Se la conversione fallisce, lancia un errore leggibile per mostrare snackbar.
 */

function isHeic(file) {
  if (!file || !file.name) return false;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === 'image/heic-sequence' ||
    type === 'image/heif-sequence'
  );
}

export async function convertHeicIfNeeded(file) {
  if (!isHeic(file)) return file;

  // Import dinamico: la libreria pesa ~50KB, la carichiamo solo quando serve
  const heic2any = (await import('heic2any')).default;

  const blob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.88,
  });

  // heic2any puo' ritornare Blob singolo o array di Blob (se HEIC contiene piu' immagini)
  const finalBlob = Array.isArray(blob) ? blob[0] : blob;

  const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
  return new File([finalBlob], newName, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}

export { isHeic };
