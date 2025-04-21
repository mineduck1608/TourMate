using Repositories.Models;

namespace Repositories.DTO.CreateModels
{
    public class ActiveAreaCreateModel
    {

        public string AreaName { get; set; }

        public string AreaTitle { get; set; }

        public string AreaSubtitle { get; set; }

        public string AreaContent { get; set; }

        public string BannerImg { get; set; }
        public ActiveArea Convert() => new()
        {
            AreaName = AreaName,
            AreaTitle = AreaTitle,
            AreaSubtitle = AreaSubtitle,
            AreaContent = AreaContent,
            BannerImg = BannerImg,
            AreaId = 0,
        };
    }
}