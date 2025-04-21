using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class NewsCategoryCreateModel
    {
        public int CategoryId { get; set; }

        public int NewsId { get; set; }
        public NewsCategory Convert() => new()
        {
            CategoryId = CategoryId,
            NewsId = NewsId,
            NewsCategoryId = 0,
        };
    }
}