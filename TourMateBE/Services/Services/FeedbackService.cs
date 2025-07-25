using Repositories.Models;
using Repositories.IRepositories;
using Repositories.RequestModels;
using Repositories.ResponseModels;
using Services.IServices;
using TourMate.MailBody;

namespace Services.Services
{
    public class FeedbackService : IFeedbackService
    {
        private IFeedbackRepository FeedbackRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository)
        {
            FeedbackRepository = feedbackRepository ?? throw new ArgumentNullException(nameof(feedbackRepository));
        }

        public async Task<PaginatedFeedbackResponse> GetTourGuideFeedbacksPublicAsync(int tourGuideId, int page, int pageSize)
        {
            // Validate input parameters
            if (tourGuideId <= 0)
                throw new ArgumentException("Tour Guide ID phải lớn hơn 0");

            if (page <= 0)
                throw new ArgumentException("Page phải lớn hơn 0");

            if (pageSize <= 0 || pageSize > 100)
                throw new ArgumentException("Page size phải từ 1 đến 100");

            // Get feedbacks from repository
            var feedbacks = await FeedbackRepository.GetTourGuideFeedbacksAsync(tourGuideId, page, pageSize);
            var totalCount = await FeedbackRepository.GetTourGuideFeedbackCountAsync(tourGuideId);

            // Calculate pagination info
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // Map to DTOs
            var feedbackDtos = feedbacks.Select(f => new PublicFeedbackDto
            {
                FeedbackId = f.FeedbackId,
                CustomerId = f.CustomerId,
                TourGuideId = f.TourGuideId,
                CreatedDate = f.CreatedDate,
                Content = f.Content,
                Rating = f.Rating,
                InvoiceId = f.InvoiceId ?? 0,
                CustomerName = f.Customer.FullName,
                CustomerAvatar = f.Customer.Image,
                CustomerAccountId = f.Customer?.AccountId,
                TourName = f.Invoice?.TourName,
                StartDate = f.Invoice?.StartDate
            }).ToList();

            return new PaginatedFeedbackResponse
            {
                Result = feedbackDtos,
                TotalCount = totalCount,
                TotalPage = totalPages,
                CurrentPage = page,
                PageSize = pageSize
            };
        }

        public async Task<Feedback> GetFeedback(int id)
        {
            return await FeedbackRepository.GetByIdAsync(id);
        }

        public async Task<Feedback> GetFeedbackContainInvoice(int id)
        {
            return await FeedbackRepository.GetByIdContainInvoiceAsync(id);
        }

        public async Task<Feedback> GetFeedbackByInvoice(int id)
        {
            return await FeedbackRepository.GetByInvoiceAsync(id);
        }

        public async Task<List<TourGuideFeedback>> GetFeedbackByAccount(int id)
        {
            var result = await FeedbackRepository.GetByAccountAsync(id); // Có thể là List<Feedback>

            var feedbackList = result.Select(f => new TourGuideFeedback
            {
                FeedbackId = f.FeedbackId,
                CustomerAccountId = f.Customer.AccountId,
                CustomerName = f.Customer.FullName, // nếu có navigation property
                Rating = f.Rating,
                Content = f.Content,
                CreatedAt = f.CreatedDate.ToString("dd/MM/yyyy HH:mm:ss"),
                InvoiceId = f.InvoiceId
            }).ToList();

            return feedbackList;
        }

        public async Task<Feedback> CreateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.CreateAndReturnAsync(feedback);
        }

        public async Task<bool> UpdateFeedback(Feedback feedback)
        {
            return await FeedbackRepository.UpdateAsync(feedback);
        }

        public async Task<bool> DeleteFeedback(int id)
        {
            await FeedbackRepository.RemoveAsync(id);
            return true;
        }

        public string GenerateTourGuideFeedbackEmail(Feedback feedback) => 
            TourGuideFeedbackEmailBody.GenerateTourGuideFeedbackEmail(feedback);

        public async Task<IEnumerable<TourFeedbackDto>> GetAllTourFeedbacksAsync()
        {
            var feedbacks = await FeedbackRepository.GetAllFeedbackAsync();
            return feedbacks.Select(MapToTourFeedbackDto);
        }

        public async Task<TourFeedbackDto?> GetTourFeedbackByIdAsync(int id)
        {
            var feedback = await FeedbackRepository.GetFeedbackByIdAsync(id);
            return feedback != null ? MapToTourFeedbackDto(feedback) : null;
        }

        public async Task<IEnumerable<TourFeedbackDto>> GetTourFeedbacksByTourGuideIdAsync(int tourGuideId)
        {
            var feedbacks = await FeedbackRepository.GetByTourGuideIdAsync(tourGuideId);
            return feedbacks.Select(MapToTourFeedbackDto);
        }

        public async Task<IEnumerable<TourFeedbackDto>> GetTourFeedbacksByRatingAsync(int rating)
        {
            var feedbacks = await FeedbackRepository.GetByRatingAsync(rating);
            return feedbacks.Select(MapToTourFeedbackDto);
        }

        
        public async Task<FeedbackStatsDto> GetTourFeedbackStatsAsync()
        {
            var allFeedbacks = await FeedbackRepository.GetAllFeedbackAsync();
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

       

        public async Task<IEnumerable<TopTourGuideDto>> GetTopTourGuidesAsync(int limit = 10)
        {
            var allFeedbacks = await FeedbackRepository.GetAllFeedbackAsync();

            var topGuides = allFeedbacks
                .GroupBy(f => new { f.TourGuideId, f.TourGuide.FullName })
                .Select(g => new TopTourGuideDto
                {
                    TourGuideId = g.Key.TourGuideId,
                    Name = g.Key.FullName,
                    AverageRating = (decimal)g.Average(f => f.Rating),
                    TotalReviews = g.Count()
                })
                .OrderByDescending(tg => tg.AverageRating)
                .ThenByDescending(tg => tg.TotalReviews)
                .Take(limit);

            return topGuides;
        }


        private static TourFeedbackDto MapToTourFeedbackDto(Feedback feedback)
        {
            return new TourFeedbackDto
            {
                FeedbackId = feedback.FeedbackId,
                CustomerId = feedback.CustomerId,
                CustomerName = feedback.Customer?.FullName ?? "",
                TourGuideId = feedback.TourGuideId,
                TourGuideName = feedback.TourGuide?.FullName ?? "",
                TourName = feedback.Invoice?.TourName ?? "",
                Content = feedback.Content,
                Rating = feedback.Rating,
                CreatedDate = feedback.CreatedDate,
                UpdatedAt = feedback.UpdatedAt,
                InvoiceId = feedback.InvoiceId,
                IsDeleted = feedback.IsDeleted
            };
        }
    }
}