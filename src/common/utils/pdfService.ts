import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function gerarPDFDoHtml(template: string, referencia: string) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true, // Compactação ativada
  });
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
        const canvas = await html2canvas(iframeDoc.body, { scale: 5 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft >= 0) {
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
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

export function gerarPDFDoHtmlWhatsapp(html: string, referencia: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
      // Cria um iframe para renderizar o HTML temporariamente, como no método gerarPDFDoHtml
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
          reject(new Error("Não foi possível acessar o iframe para renderização"));
          return;
      }

      // Escreve o HTML no iframe e aplica o estilo
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // Espera o carregamento do iframe para renderizar com html2canvas
      iframe.onload = async () => {
          try {
              // Usa uma escala alta para melhorar a qualidade e manter as dimensões do PDF
              const canvas = await html2canvas(iframeDoc.body, {
                scale: 5,
              });
              const imgData = canvas.toDataURL('image/png');

              // Define o documento PDF e dimensões
              const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true, // Compactação ativada
              });
              pdf.setProperties({ title: referencia });

              const imgWidth = 210; // largura em mm para A4
              const pageHeight = 295; // altura em mm para A4
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              let heightLeft = imgHeight;
              let position = 0; // Início da primeira página
              const marginTop = 10; // Margem superior adicional
              
              while (heightLeft >= 0) {
                pdf.addImage(imgData, 'PNG', 0, position + marginTop, imgWidth, imgHeight); // Ajuste de margem
                heightLeft -= pageHeight;
                if (heightLeft >= 0) {
                  position = -heightLeft; // Nova posição com margem
                  pdf.addPage();
                }
              }

              // Gera o Blob do PDF e resolve
              const pdfBlob = pdf.output('blob');
              document.body.removeChild(iframe);
              resolve(pdfBlob);
          } catch (error) {
              document.body.removeChild(iframe);
              console.error("Erro ao gerar PDF:", error);
              reject(error);
          }
      };
  });
}
