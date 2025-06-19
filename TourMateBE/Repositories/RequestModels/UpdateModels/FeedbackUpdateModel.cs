using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.UpdateModels
{
    public class FeedbackUpdateModel
    {
        public int FeedbackId { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}
