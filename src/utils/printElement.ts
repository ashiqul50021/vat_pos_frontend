/**
 * Robust print helper:
 * Clones the printable invoice directly into <body> as a top-level #dedicated-print-node.
 * During @media print, #root is completely hidden (display: none), and ONLY #dedicated-print-node is visible.
 * This guarantees zero modal clipping, zero overflow bugs, and eliminates blank pages in all browsers.
 */
export const printElement = (elementId: string) => {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    window.print();
    return;
  }

  // Remove any leftover print node
  const oldNode = document.getElementById('dedicated-print-node');
  if (oldNode) {
    oldNode.remove();
  }

  // Create clean top-level node attached directly to document.body
  const printNode = document.createElement('div');
  printNode.id = 'dedicated-print-node';
  printNode.innerHTML = sourceElement.innerHTML;
  document.body.appendChild(printNode);

  // Trigger print
  window.print();

  // Cleanup after print dialog closes
  const cleanup = () => {
    try {
      if (document.body.contains(printNode)) {
        document.body.removeChild(printNode);
      }
    } catch (e) {
      // ignore
    }
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);
  // Fallback cleanup timer in case afterprint doesn't fire
  setTimeout(cleanup, 3000);
};
