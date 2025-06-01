using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Account
{
    public int AccountId { get; set; }

    public string Email { get; set; } = null!;

    public string? Password { get; set; }

    public DateTime CreatedDate { get; set; }

    public int RoleId { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<AccountMembership> AccountMemberships { get; set; } = new List<AccountMembership>();

    public virtual ICollection<Conversation> ConversationAccount1s { get; set; } = new List<Conversation>();

    public virtual ICollection<Conversation> ConversationAccount2s { get; set; } = new List<Conversation>();

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual Role Role { get; set; }

    public virtual ICollection<TourBid> TourBids { get; set; } = new List<TourBid>();

    public virtual ICollection<TourGuide> TourGuides { get; set; } = new List<TourGuide>();
}
