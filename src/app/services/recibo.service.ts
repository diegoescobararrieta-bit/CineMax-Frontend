import { Injectable } from '@angular/core';
import { Compra } from '../models/compra.model';

@Injectable({ providedIn: 'root' })
export class ReciboService {
  async descargar(c: Compra): Promise<void> {
    // La librería se carga solo cuando se pide un recibo
    const { jsPDF } = await import('jspdf');

    const ancho = 100;
    const alto = 220;
    const margen = 10;
    const maxAncho = ancho - margen * 2;
    const doc = new jsPDF({ unit: 'mm', format: [ancho, alto] });

    const dinero = (n: number): string =>
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      })
        .format(n)
        .replace(/\u00a0/g, ' ');

    // Encabezado
    doc.setFillColor(18, 0, 43);
    doc.rect(0, 0, ancho, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('CINEMAX', ancho / 2, 14, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(217, 194, 255);
    doc.text('Recibo de compra de boletas', ancho / 2, 22, { align: 'center' });

    let y = 38;

    const campo = (etiqueta: string, valor: string): void => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(106, 27, 154);
      doc.text(etiqueta.toUpperCase(), margen, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(34, 34, 34);
      const lineas = doc.splitTextToSize(valor, maxAncho);
      doc.text(lineas, margen, y);
      y += lineas.length * 4.8 + 3;
    };

    const fechaCompra = c.fechaCompra
      ? `${c.fechaCompra.substring(0, 10)} ${c.fechaCompra.substring(11, 16)}`
      : '';
    const tipo = c.ubicacion === 'GENERAL_PLUS' ? 'CineMax+ (VIP)' : 'Estándar';

    campo('Recibo No.', String(c.id).padStart(6, '0'));
    campo('Fecha de compra', fechaCompra);
    campo('Cliente', c.nombreCliente);
    campo('Película', c.funcion.pelicula.titulo);
    campo('Función', `${c.funcion.fecha} · ${c.funcion.hora.substring(0, 5)}`);
    campo('Sala', `${c.funcion.sala} · ${c.funcion.formato} ${c.funcion.idioma}`);
    campo('Tipo de boleta', tipo);

    // Separador punteado
    y += 1;
    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(margen, y, ancho - margen, y);
    doc.setLineDashPattern([], 0);
    y += 7;

    const filaDinero = (texto: string, valor: string): void => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(34, 34, 34);
      doc.text(texto, margen, y);
      doc.text(valor, ancho - margen, y, { align: 'right' });
      y += 6;
    };

    filaDinero(
      `${c.cantidadBoletos} x ${dinero(c.precioUnitario)}`,
      dinero(c.precioUnitario * c.cantidadBoletos),
    );
    filaDinero('Cargo por servicio', dinero(c.cargoServicio));
    y += 2;

    // Total
    doc.setFillColor(243, 229, 245);
    doc.roundedRect(margen - 2, y, maxAncho + 4, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(106, 27, 154);
    doc.text('TOTAL PAGADO', margen, y + 9.5);
    doc.setFontSize(15);
    doc.setTextColor(18, 0, 43);
    doc.text(dinero(c.valorTotal), ancho - margen, y + 10.5, { align: 'right' });
    y += 26;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text('¡Gracias por tu compra!', ancho / 2, y, { align: 'center' });
    doc.text('Presenta este recibo en la taquilla.', ancho / 2, y + 4.5, { align: 'center' });

    // Pie con el logo
    const altoPie = 32;
    doc.setFillColor(18, 0, 43);
    doc.rect(0, alto - altoPie, ancho, altoPie, 'F');
    try {
      const img = await this.cargarImagen('/img/logo-cinemax.png');
      const w = 56;
      const h = (w * img.naturalHeight) / img.naturalWidth;
      doc.addImage(img, 'PNG', (ancho - w) / 2, alto - altoPie + (altoPie - h) / 2, w, h);
    } catch {
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('CineMax', ancho / 2, alto - altoPie / 2 + 2, { align: 'center' });
    }

    doc.save(`recibo-cinemax-${String(c.id).padStart(6, '0')}.pdf`);
  }

  private cargarImagen(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo cargar ' + url));
      img.src = url;
    });
  }
}
