using Repositories.DTO;
using Repositories.Models;
using AutoMapper;

namespace TourMate.Mappings
{
    public class RevenueProfile : Profile
    {
        public RevenueProfile()
        {
            CreateMap<Revenue, RevenueDto>()
                .ForMember(dest => dest.TourGuideName, opt => opt.MapFrom(src => src.TourGuide.FullName ?? ""));

            CreateMap<RevenueDto, Revenue>()
                .ForMember(dest => dest.TourGuide, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
}
