using System;
using System.IO;
using UglyToad.PdfPig;

public interface IPdfExtractor
{
    void Extract(string pdfPath, string outputPath);
}

public class PdfExtractor : IPdfExtractor
{
    public void Extract(string pdfPath, string outputPath)
    {
        if (!File.Exists(pdfPath))
            throw new FileNotFoundException("Le fichier PDF est introuvable.", pdfPath);

        using (var writer = new StreamWriter(outputPath))
        {
            using (var document = PdfDocument.Open(pdfPath))
            {
                for (int i = 0; i < document.NumberOfPages; i++)
                {
                    var page = document.GetPage(i + 1);
                    writer.WriteLine($"--- Page {i + 1} ---");
                    writer.WriteLine(page.Text);
                    writer.WriteLine();
                }
            }
        }
    }
}
