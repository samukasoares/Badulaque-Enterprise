import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function gerarPDFDoHtml(template: string, referencia: string) {
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.setProperties({ title: referencia });

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  document.body.appendChild(iframe);

  if (!iframe.contentWindow) return;

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(template);
  iframeDoc.close();

  return new Promise<void>((resolve, reject) => {
    iframe.onload = async () => {
      try {
        const canvas = await html2canvas(iframeDoc.body, { scale: 6 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft >= 0) {
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          if (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
          }
        }

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl);
        document.body.removeChild(iframe);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}
