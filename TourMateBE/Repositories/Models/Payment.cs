using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public float Price { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CompleteDate { get; set; }

    /// <summary>
    /// membership / invoice
    /// </summary>
    public string PaymentType { get; set; } = null!;

    /// <summary>
    /// momo/ vnpay
    /// </summary>
    public string PaymentMethod { get; set; } = null!;

    public int AccountId { get; set; }

    public int? MembershipPackageId { get; set; }

    public int? InvoiceId { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual Invoice? Invoice { get; set; }

    public virtual MembershipPackage? MembershipPackage { get; set; }

    public virtual ICollection<SystemRevenue> SystemRevenues { get; set; } = new List<SystemRevenue>();

    public virtual ICollection<TourGuideRevenue> TourGuideRevenues { get; set; } = new List<TourGuideRevenue>();
}
