using System.Collections.Generic;

namespace UniSphere.Core.AI
{
    /// <summary>
    /// AI tarafından düzeltilmiş metin ve açıklamalarını tutan Core modelidir.
    /// </summary>
    public class EventDescriptionImprovementResult
    {
        public string OriginalText { get; set; } = string.Empty;
        public string ImprovedText { get; set; } = string.Empty;
        public List<string> Explanations { get; set; } = new List<string>();
    }
}
