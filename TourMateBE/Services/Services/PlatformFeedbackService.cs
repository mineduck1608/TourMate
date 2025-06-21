using Repositories.Models;
using Repositories.IRepositories;
using Repositories.RequestModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.IServices;

namespace Services.Services
{
    public class PlatformFeedbackService : IPlatformFeedbackService
    {
        private IPlatformFeedbackRepository _platformFeedbackRepository;

        public PlatformFeedbackService(IPlatformFeedbackRepository platformFeedbackRepository)
        {
            _platformFeedbackRepository = platformFeedbackRepository ?? throw new ArgumentNullException(nameof(platformFeedbackRepository));
        }

        public async Task<bool> CreatePlatformFeedback(PlatformFeedback data)
        {
            return await _platformFeedbackRepository.CreateAsync(data);
        }

        public async Task<IEnumerable<PlatformFeedbackDto>> GetAllPlatformFeedbacksAsync()
        {
            var feedbacks = await _platformFeedbackRepository.GetAllPlatformFeedback();
            return feedbacks.Select(MapToPlatformFeedbackDto);
        }

        public async Task<PlatformFeedbackDto?> GetPlatformFeedbackByIdAsync(int id)
        {
            var feedback = await _platformFeedbackRepository.GetPlatformFeedbackByIdAsync(id);
            return feedback != null ? MapToPlatformFeedbackDto(feedback) : null;
        }

        public async Task<IEnumerable<PlatformFeedbackDto>> GetPlatformFeedbacksByRatingAsync(int rating)
        {
            var feedbacks = await _platformFeedbackRepository.GetByRatingAsync(rating);
            return feedbacks.Select(MapToPlatformFeedbackDto);
        }

        public async Task<PlatformFeedbackDto> CreatePlatformFeedbackAsync(CreatePlatformFeedbackDto dto)
        {
            var feedback = new PlatformFeedback
            {
                AccountId = dto.AccountId,
                PaymentId = dto.PaymentId,
                Rating = dto.Rating,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            var createdFeedback = await _platformFeedbackRepository.CreateAndReturnAsync(feedback);

            // Reload with navigation properties
            var reloadedFeedback = await _platformFeedbackRepository.GetByIdAsync(createdFeedback.FeedbackId);
            return MapToPlatformFeedbackDto(reloadedFeedback!);
        }

        public async Task<FeedbackStatsDto> GetPlatformFeedbackStatsAsync()
        {
            var allFeedbacks = await _platformFeedbackRepository.GetAllPlatformFeedback();
            var feedbackList = allFeedbacks.ToList();

            if (!feedbackList.Any())
            {
                return new FeedbackStatsDto
                {
                    TotalFeedbacks = 0,
                    AverageRating = 0,
                    RatingDistribution = Enumerable.Range(1, 5).Select(i => new RatingDistributionDto
                    {
                        Rating = i,
                        Count = 0,
                        Percentage = 0
                    }).ToList()
                };
            }

            var totalCount = feedbackList.Count;
            var averageRating = (decimal)feedbackList.Average(f => f.Rating);

            var ratingDistribution = feedbackList
                .GroupBy(f => f.Rating)
                .Select(g => new RatingDistributionDto
                {
                    Rating = g.Key,
                    Count = g.Count(),
                    Percentage = (decimal)g.Count() / totalCount * 100
                })
                .ToList();

            // Ensure all ratings 1-5 are present
            for (int i = 1; i <= 5; i++)
            {
                if (!ratingDistribution.Any(r => r.Rating == i))
                {
                    ratingDistribution.Add(new RatingDistributionDto
                    {
                        Rating = i,
                        Count = 0,
                        Percentage = 0
                    });
                }
            }

            ratingDistribution = ratingDistribution.OrderBy(r => r.Rating).ToList();

            return new FeedbackStatsDto
            {
                TotalFeedbacks = totalCount,
                AverageRating = averageRating,
                RatingDistribution = ratingDistribution
            };
        }

        private static PlatformFeedbackDto MapToPlatformFeedbackDto(PlatformFeedback feedback)
        {
            return new PlatformFeedbackDto
            {
                FeedbackId = feedback.FeedbackId,
                AccountId = feedback.AccountId,
                AccountName = feedback.Account.Email,
                PaymentId = feedback.PaymentId,
                Rating = feedback.Rating,
                Content = feedback.Content,
                CreatedAt = feedback.CreatedAt
            };
        }

    }
}
