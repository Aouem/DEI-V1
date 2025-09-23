using System.IO;
using UglyToad.PdfPig;

namespace DEI.Services
{
    public class PdfExtractor
    {
        public static void ExtractQuestionsFromPdf(string pdfPath, string outputPath)
        {
            using (var document = PdfDocument.Open(pdfPath))
            using (var writer = new StreamWriter(outputPath))
            {
                int pageIndex = 1;
                foreach (var page in document.GetPages())
                {
                    writer.WriteLine($"--- Page {pageIndex++} ---");
                    writer.WriteLine(page.Text);
                    writer.WriteLine();
                }
            }
        }
    }
}
