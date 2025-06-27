using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.DTO.CreateModels
{
    public class RefreshTokenCreateModel
    {
        public Guid? Id { get; set; }

        public int UserId { get; set; }

        public string Token { get; set; }

        public DateTime ExpireAt { get; set; }

        public bool IsRevoked { get; set; }

        public DateTime CreatedAt { get; set; }
        public RefreshToken Convert() => new()
        {
            Id = Id ?? Guid.Empty,
            UserId = UserId,
            Token = Token,
            ExpireAt = ExpireAt,
            CreatedAt = CreatedAt,
        };
    }
}
