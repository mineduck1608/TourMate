using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class AccountMembership
{
    public int AccountMembershipId { get; set; }

    public int AccountId { get; set; }

    public int MembershipPackageId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public bool IsActive { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual MembershipPackage MembershipPackage { get; set; } = null!;
}
