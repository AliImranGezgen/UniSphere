using System.Threading.Tasks;
using UniSphere.Core.AI;

namespace UniSphere.Core.Interfaces
{
    /// <summary>
    /// Etkinlik açıklamalarını yapay zeka kullanarak iyileştiren servisin sözleşmesidir.
    /// </summary>
    public interface IEventDescriptionImprovementService
    {
        /// <summary>
        /// Verilen metni AI modeline göndererek profesyonel bir şekilde iyileştirir 
        /// ve düzeltme açıklamalarını döndürür.
        /// </summary>
        /// <param name="originalText">Kullanıcının girdiği ham etkinlik açıklaması</param>
        /// <returns>Düzeltilmiş metin ve açıklamaları içeren sonuç modeli</returns>
        Task<EventDescriptionImprovementResult> ImproveDescriptionAsync(string originalText);
    }
}
