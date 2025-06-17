using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class MembershipPackage
{
    public int MembershipPackageId { get; set; }

    public string Name { get; set; } = null!;

    public float Price { get; set; }

    /// <summary>
    /// in day
    /// </summary>
    public int Duration { get; set; }

    public string BenefitDesc { get; set; } = null!;

    public virtual ICollection<AccountMembership> AccountMemberships { get; set; } = new List<AccountMembership>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
