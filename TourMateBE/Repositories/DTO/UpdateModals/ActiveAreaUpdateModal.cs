using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModals
{
    public class ActiveAreaUpdateModal
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }

        public string AreaTitle { get; set; }

        public string AreaSubtitle { get; set; }

        public string AreaContent { get; set; }

        public string BannerImg { get; set; }
        public string AreaType { get; set; }
        public DateTime CreatedAt { get; set; }
        public ActiveArea Convert() => new()
        {
            AreaName = AreaName,
            AreaTitle = AreaTitle,
            AreaSubtitle = AreaSubtitle,
            AreaContent = AreaContent,
            BannerImg = BannerImg,
            AreaId = AreaId,
            AreaType = AreaType,
            CreatedAt = CreatedAt,            
        };
    }
}
