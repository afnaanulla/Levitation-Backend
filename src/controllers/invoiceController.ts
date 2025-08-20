import { Response } from 'express';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice';
import { AuthRequest } from '../middleware/auth';

export const generateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { products } = req.body;
    
    // Calculate totals
    let subtotal = 0;
    const gstRate = 0.18;
    
    const processedProducts = products.map((product: any) => {
      const total = product.qty * product.rate;
      const gst = total * gstRate;
      subtotal += total;
      return {
        ...product,
        total,
        gst
      };
    });
    
    const gstAmount = subtotal * gstRate;
    const grandTotal = subtotal + gstAmount;
    
    // Save invoice to database
    const invoice = await Invoice.create({
      user: req.user._id,
      products: processedProducts,
      subtotal,
      gstAmount,
      grandTotal
    });
    
    // Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Create HTML content for the invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { color: #333; }
          .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info div { width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { text-align: right; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>INVOICE</h1>
            <p>Invoice #${String(invoice._id).slice(-6).toUpperCase()}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="info">
            <div>
              <h3>From:</h3>
              <p>Your Company Name</p>
              <p>123 Business Street</p>
              <p>City, State, ZIP</p>
            </div>
            <div>
              <h3>To:</h3>
              <p>${req.user.name}</p>
              <p>${req.user.email}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total</th>
                <th>GST (18%)</th>
              </tr>
            </thead>
            <tbody>
              ${processedProducts.map((product: any) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.qty}</td>
                  <td>$${product.rate.toFixed(2)}</td>
                  <td>$${product.total.toFixed(2)}</td>
                  <td>$${product.gst.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Subtotal: $${subtotal.toFixed(2)}</p>
            <p>GST (18%): $${gstAmount.toFixed(2)}</p>
            <p><strong>Grand Total: $${grandTotal.toFixed(2)}</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};