using System.IO;
using System.Linq;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using DEI.Models;

namespace DEI.Services
{
    public class RapportService
    {
        public byte[] GenererRapportPdf(AlarmResponse response)
        {
            using var memoryStream = new MemoryStream();
            var writer = new PdfWriter(memoryStream);
            var pdf = new PdfDocument(writer);
            var document = new Document(pdf);

            // Fonts
            var sectionFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
            var normalFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
            var italicFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_OBLIQUE);

            // En-tête
            var title = new Paragraph("ANALYSE D'ÉVÉNEMENT INDÉSIRABLE")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(16)
                .SetFont(sectionFont);
            document.Add(title);

            document.Add(new Paragraph($"Date de création: {response.CreatedAt:dd/MM/yyyy HH:mm}")
                .SetTextAlignment(TextAlignment.RIGHT)
                .SetFontSize(10));

            // Groupage par catégorie (nécessite les bonnes propriétés dans AlarmAnswer)
            var groupedResponses = response.Reponses
                .GroupBy(r => r.Categorie)
                .OrderBy(g => g.Key);

            foreach (var group in groupedResponses)
            {
                // Titre de la catégorie
                document.Add(new Paragraph(group.Key.ToUpper())
                    .SetFont(sectionFont)
                    .SetFontSize(14)
                    .SetMarginTop(15));

                foreach (var item in group)
                {
                    document.Add(new Paragraph(item.SousCategorie)
                        .SetFont(sectionFont)
                        .SetFontSize(12)
                        .SetMarginTop(10));

                    document.Add(new Paragraph($"Question: {item.Question}")
                        .SetFont(normalFont));

                    document.Add(new Paragraph($"Réponse: {item.Reponse}")
                        .SetFont(normalFont)
                        .SetMarginBottom(10));

                    if (!string.IsNullOrEmpty(item.Commentaire))
                    {
                        document.Add(new Paragraph($"Commentaire: {item.Commentaire}")
                            .SetFont(italicFont)
                            .SetMarginBottom(15));
                    }

                    document.Add(new Paragraph(new string('-', 50))
                        .SetFontColor(ColorConstants.LIGHT_GRAY));
                }
            }

            document.Close();
            return memoryStream.ToArray();
        }
    }
}
