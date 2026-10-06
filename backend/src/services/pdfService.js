import PDFDocument from 'pdfkit'

/**
 * Generate official payment receipt PDF and stream to response
 */
export const generateReceiptPdf = (payment, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `inline; filename="receipt-${payment.id || payment.transactionId}.pdf"`
  )

  doc.pipe(res)

  // Header Banner
  doc.rect(0, 0, 595.28, 80).fill('#E91E63')
  doc.fillColor('#FFFFFF')
  doc.fontSize(22).font('Helvetica-Bold').text('TAILORCONNECT ESCROW INVOICE', 50, 25)
  doc.fontSize(11).font('Helvetica').text('Tailoring Services & Fashion Learning Platform', 50, 50)

  doc.moveDown(3)
  doc.fillColor('#333333')

  // Receipt meta
  const startY = 110
  doc.fontSize(10).font('Helvetica-Bold').text('RECEIPT DETAILS', 50, startY)
  doc.font('Helvetica')
  doc.text(`Receipt Reference: #${payment.paymentNumber || payment.id || 'PAY-REF'}`, 50, startY + 16)
  doc.text(`Transaction ID: ${payment.transactionId}`, 50, startY + 30)
  doc.text(`Payment Date: ${new Date(payment.paidAt || Date.now()).toLocaleString()}`, 50, startY + 44)
  doc.text(`Payment Status: ${payment.status || 'SUCCESSFUL'}`, 50, startY + 58)

  doc.fontSize(10).font('Helvetica-Bold').text('BILLED TO', 350, startY)
  doc.font('Helvetica')
  doc.text(`Name: ${payment.userName || 'Valued Customer'}`, 350, startY + 16)
  doc.text(`User Type: ${payment.userType || 'Customer'}`, 350, startY + 30)
  doc.text(`Payment Method: ${payment.paymentMethod || 'UPI / Online'}`, 350, startY + 44)

  // Divider
  doc.moveTo(50, 195).lineTo(545, 195).strokeColor('#E0E0E0').stroke()

  // Table header
  doc.rect(50, 210, 495, 24).fill('#FCE4EC')
  doc.fillColor('#C2185B').font('Helvetica-Bold').fontSize(10)
  doc.text('ITEM / SERVICE DESCRIPTION', 60, 217)
  doc.text('STUDIO / TAILOR', 320, 217)
  doc.text('AMOUNT (INR)', 450, 217, { align: 'right' })

  // Table row
  doc.fillColor('#333333').font('Helvetica').fontSize(10)
  doc.text(payment.title || 'Customized Dress Tailoring Service', 60, 245)
  doc.text(payment.tailorName || 'Tailor Boutique Studio', 320, 245)
  doc.text(`₹${Number(payment.amount || 0).toLocaleString()}`, 450, 245, { align: 'right' })

  // Summary box
  const summaryY = 290
  doc.moveTo(50, summaryY).lineTo(545, summaryY).strokeColor('#E0E0E0').stroke()

  doc.font('Helvetica').fontSize(10)
  doc.text('Platform Escrow Fee:', 350, summaryY + 15)
  doc.text(`₹${payment.platformFee || 50}`, 450, summaryY + 15, { align: 'right' })

  doc.text('GST (5%):', 350, summaryY + 30)
  doc.text(`₹${payment.gst || Math.round((payment.amount || 0) * 0.05)}`, 450, summaryY + 30, { align: 'right' })

  doc.font('Helvetica-Bold').fontSize(12).fillColor('#E91E63')
  const total = (Number(payment.amount || 0) + Number(payment.platformFee || 50) + Number(payment.gst || Math.round((payment.amount || 0) * 0.05)))
  doc.text('Total Paid:', 350, summaryY + 50)
  doc.text(`₹${total.toLocaleString()}`, 450, summaryY + 50, { align: 'right' })

  // Escrow guarantee note
  doc.rect(50, 390, 495, 55).fill('#F9F9F9').strokeColor('#E0E0E0').stroke()
  doc.fillColor('#2E7D32').font('Helvetica-Bold').fontSize(10)
  doc.text('✓ 100% SECURE ESCROW PROTECTION GUARANTEED', 65, 402)
  doc.fillColor('#666666').font('Helvetica').fontSize(9)
  doc.text('Funds remain in platform escrow and are released to the tailor upon customer approval of stitching delivery.', 65, 418)

  // Footer
  doc.fillColor('#999999').fontSize(8)
  doc.text('TailorConnect Marketplace • Automated Tax Invoice • For customer support email support@tailorconnect.com', 50, 750, { align: 'center', width: 495 })

  doc.end()
}

/**
 * Generate official landscape certificate of completion PDF and stream to response
 */
export const generateCertificatePdf = (cert, res) => {
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margin: 40
  })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `inline; filename="certificate-${cert.certificateId || cert.id}.pdf"`
  )

  doc.pipe(res)

  const pageWidth = 841.89
  const pageHeight = 595.28

  // Outer border & background
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(4).strokeColor('#E91E63').stroke()
  doc.rect(26, 26, pageWidth - 52, pageHeight - 52).lineWidth(1).strokeColor('#C2185B').stroke()

  // Header
  doc.fillColor('#C2185B').font('Helvetica-Bold').fontSize(14)
  doc.text('TAILORCONNECT ACADEMY OF FASHION & EMBROIDERY', 0, 70, { align: 'center' })

  doc.fillColor('#212121').font('Helvetica-Bold').fontSize(28)
  doc.text('CERTIFICATE OF ACHIEVEMENT', 0, 105, { align: 'center' })

  doc.fillColor('#757575').font('Helvetica').fontSize(12)
  doc.text('THIS IS PROUDLY PRESENTED TO', 0, 155, { align: 'center' })

  // Student Name
  doc.fillColor('#E91E63').font('Helvetica-Bold').fontSize(26)
  doc.text(cert.studentName.toUpperCase(), 0, 185, { align: 'center' })
  doc.moveTo(220, 220).lineTo(620, 220).strokeColor('#E91E63').lineWidth(1.5).stroke()

  // Description
  doc.fillColor('#424242').font('Helvetica').fontSize(13)
  doc.text('for successfully completing the rigorous masterclass and practical needlework evaluation in', 0, 240, { align: 'center' })

  doc.fillColor('#1A237E').font('Helvetica-Bold').fontSize(18)
  doc.text(cert.courseName, 0, 270, { align: 'center' })

  doc.fillColor('#616161').font('Helvetica').fontSize(12)
  doc.text(`Course Duration: ${cert.duration || '15 Days'} | Grade Awarded: ${cert.grade || 'Exemplary with Distinction'}`, 0, 310, { align: 'center' })

  // Signatures
  const sigY = 410
  // Instructor
  doc.moveTo(100, sigY).lineTo(300, sigY).strokeColor('#9E9E9E').lineWidth(1).stroke()
  doc.fillColor('#212121').font('Helvetica-Bold').fontSize(11)
  doc.text(cert.tailorName || 'Master Instructor', 100, sigY + 8, { width: 200, align: 'center' })
  doc.fillColor('#757575').font('Helvetica').fontSize(9)
  doc.text(cert.shopName || 'Studio Master Tailor', 100, sigY + 22, { width: 200, align: 'center' })

  // Academy Seal / Badge in Center
  doc.circle(pageWidth / 2, sigY - 15, 36).fillColor('#FCE4EC').fill().strokeColor('#E91E63').lineWidth(2).stroke()
  doc.fillColor('#E91E63').font('Helvetica-Bold').fontSize(10)
  doc.text('VERIFIED', pageWidth / 2 - 26, sigY - 24, { width: 52, align: 'center' })
  doc.fontSize(8).text('TC-ACADEMY', pageWidth / 2 - 30, sigY - 10, { width: 60, align: 'center' })

  // Director
  doc.moveTo(pageWidth - 300, sigY).lineTo(pageWidth - 100, sigY).strokeColor('#9E9E9E').lineWidth(1).stroke()
  doc.fillColor('#212121').font('Helvetica-Bold').fontSize(11)
  doc.text('Director of Certification', pageWidth - 300, sigY + 8, { width: 200, align: 'center' })
  doc.fillColor('#757575').font('Helvetica').fontSize(9)
  doc.text('TailorConnect Governance Board', pageWidth - 300, sigY + 22, { width: 200, align: 'center' })

  // Bottom verification code
  doc.fillColor('#9E9E9E').font('Helvetica').fontSize(9)
  doc.text(
    `Certificate ID: ${cert.certificateId || cert.id} • Issued on ${cert.completionDate || new Date().toISOString().split('T')[0]} • Verification: ${cert.verificationCode || 'TC-VERIFIED'}`,
    0,
    pageHeight - 50,
    { align: 'center' }
  )

  doc.end()
}
