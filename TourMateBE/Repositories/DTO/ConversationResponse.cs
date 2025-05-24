using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO
{
    public class ConversationResponse
    {
        public Conversation Conversation { get; set; }
        public string AccountName1 { get; set; }
        public string AccountName2 { get; set; }
        public Message LatestMessage { get; set; }  // Tin nhắn mới nhất trong conversation
        public bool IsRead { get; set; }             // Trạng thái đã đọc (dựa vào message)
    }

}
