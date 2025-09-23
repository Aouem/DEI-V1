using DEI.Models;


public class AnalyseRisqueService
{
    public Dictionary<string, int> CalculerScores(AnalyseRisque analyse)
    {
        var scores = new Dictionary<string, int>();
        
        foreach (var facteur in analyse.FacteursRisque)
        {
            if (!string.IsNullOrEmpty(facteur.Reponse))
            {
                // Simple analyse basée sur la présence de mots-clés
                var risque = 0;
                
                if (facteur.Reponse.Contains("important") || facteur.Reponse.Contains("critique"))
                    risque = 3;
                else if (facteur.Reponse.Contains("modéré") || facteur.Reponse.Contains("possible"))
                    risque = 2;
                else if (facteur.Reponse.Contains("faible") || facteur.Reponse.Contains("négligeable"))
                    risque = 1;
                
                if (scores.ContainsKey(facteur.Categorie))
                    scores[facteur.Categorie] += risque;
                else
                    scores.Add(facteur.Categorie, risque);
            }
        }
        
        return scores;
    }
}