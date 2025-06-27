using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace TourMate.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/imagekit")]
    public class ImageKitController : ControllerBase
    {
        private readonly IConfiguration _config;

        public ImageKitController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadToImageKit(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var privateKey = _config["IMAGEKIT_PRIVATE_KEY"];

            // Đọc nội dung file thành base64
            using var stream = file.OpenReadStream();
            using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();
            var base64File = Convert.ToBase64String(bytes);

            using var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, "https://upload.imagekit.io/api/v1/files/upload");

            var content = new MultipartFormDataContent
        {
            { new StringContent(base64File), "file" },
            { new StringContent(file.FileName), "fileName" },
            { new StringContent("/tourmate"), "folder" }
        };

            request.Headers.Authorization = new AuthenticationHeaderValue("Basic",
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{privateKey}:")));

            request.Content = content;

            var response = await client.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, responseContent);

            var json = JsonDocument.Parse(responseContent);
            var url = json.RootElement.GetProperty("url").GetString();

            return Ok(new { url });
        }
    }
}
