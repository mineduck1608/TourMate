using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.DTO.CreateModels;
using Repositories.DTO.ResultModels;
using Services;

namespace TourMate.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class TourBidCommentController : ControllerBase
    {
        private ITourBidCommentService service;
        public TourBidCommentController(ITourBidCommentService service)
        {
            this.service = service ?? throw new ArgumentNullException(nameof(service));
        }
        [HttpGet("from/{tourBidId}")]
        public async Task<ActionResult<PagedResult<CommentListResult>>> GetCommentsByTourBidIdAsync(int tourBidId, int pageSize = 10, int pageIndex = 1)
        {
            var result = await service.GetCommentsByTourBidIdAsync(tourBidId, pageSize, pageIndex);
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create(CommentCreateModel data)
        {
            var comment = data.Convert();
            var result = await service.Create(comment);
            return result ? CreatedAtAction(nameof(Create), new { id = comment.CommentId }, comment) : BadRequest("Failed to create comment.");
        }
    }
}
