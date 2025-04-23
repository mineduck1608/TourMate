using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class CategoryCreateModel
    {
        public string CategoryName { get; set; }
        public Category Convert() => new()
        {
            CategoryId = 0,
            CategoryName = CategoryName
        };
    }
}